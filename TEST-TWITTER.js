/**
 * Test script to verify Twitter API connection
 * Run with: node TEST-TWITTER.js
 */

import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './backend/.env' });

async function testTwitterConnection() {
  console.log('🐦 Test de connexion Twitter...\n');

  try {
    // Create Twitter client
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    // Test 1: Get authenticated user info
    console.log('1️⃣ Récupération des informations du compte...');
    const user = await client.v2.me();
    
    console.log('✅ SUCCÈS - Connecté en tant que:');
    console.log(`   Username: @${user.data.username}`);
    console.log(`   ID: ${user.data.id}`);
    console.log(`   Name: ${user.data.name}\n`);

    // Test 2: Check if we can read tweets
    console.log('2️⃣ Test de lecture des tweets...');
    const timeline = await client.v2.userTimeline(user.data.id, { max_results: 5 });
    
    console.log(`✅ SUCCÈS - ${timeline.data.data?.length || 0} tweets récupérés\n`);

    // Test 3: Verify pinned thread exists
    console.log('3️⃣ Vérification du thread épinglé...');
    const pinnedThreadId = process.env.TWITTER_PINNED_THREAD_ID;
    
    if (pinnedThreadId) {
      try {
        const pinnedTweet = await client.v2.singleTweet(pinnedThreadId);
        console.log(`✅ SUCCÈS - Thread épinglé trouvé:`);
        console.log(`   ID: ${pinnedThreadId}`);
        console.log(`   Texte: ${pinnedTweet.data.text.substring(0, 50)}...\n`);
      } catch (error) {
        console.log(`⚠️  Thread épinglé non trouvé (ID: ${pinnedThreadId})`);
        console.log(`   Vérifiez que l'ID est correct dans .env\n`);
      }
    } else {
      console.log('⚠️  TWITTER_PINNED_THREAD_ID non configuré dans .env\n');
    }

    // Test 4: Check rate limits
    console.log('4️⃣ Vérification des limites API...');
    const rateLimits = await client.v2.rateLimitStatuses();
    console.log('✅ Rate limits récupérés\n');

    console.log('═══════════════════════════════════════');
    console.log('✅ TOUS LES TESTS RÉUSSIS !');
    console.log('═══════════════════════════════════════');
    console.log('\n🚀 Votre configuration Twitter est prête !');
    console.log('\nProchaines étapes:');
    console.log('1. Lancez le backend: cd backend && npm start');
    console.log('2. Ouvrez le dashboard: http://localhost:3001/monitoring/monitoring.html');
    console.log('3. Testez avec une vraie vidéo YouTube\n');

  } catch (error) {
    console.error('❌ ERREUR lors du test Twitter:\n');
    
    if (error.code === 401) {
      console.error('⚠️  Erreur d\'authentification (401)');
      console.error('   → Vérifiez que les clés API dans .env sont correctes');
      console.error('   → Assurez-vous que l\'app a les permissions Read+Write\n');
    } else if (error.code === 403) {
      console.error('⚠️  Accès interdit (403)');
      console.error('   → Vérifiez les permissions de votre app Twitter\n');
    } else if (error.code === 429) {
      console.error('⚠️  Rate limit dépassé (429)');
      console.error('   → Attendez quelques minutes et réessayez\n');
    } else {
      console.error('Détails:', error.message);
      if (error.data) {
        console.error('Data:', JSON.stringify(error.data, null, 2));
      }
    }
    
    process.exit(1);
  }
}

// Run the test
testTwitterConnection();
