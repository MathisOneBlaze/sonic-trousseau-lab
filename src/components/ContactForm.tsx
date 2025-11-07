import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import Captcha from "@/components/Captcha";
import formSubmissionService from "@/services/FormSubmissionService";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  formula: z.string().min(1, "Veuillez sélectionner une formule"),
  participants: z.string().min(1, "Veuillez indiquer le nombre de participants"),
  location: z.string().min(3, "Veuillez indiquer le lieu"),
  dates: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  comment: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter le traitement de vos données",
  }),
});

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      formula: "",
      participants: "",
      location: "",
      dates: "",
      equipment: [],
      comment: "",
      consent: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const bookingData: Omit<import('@/types/submission').BookingSubmission, 'id' | 'timestamp'> = {
        source: 'booking',
        consent: values.consent,
        name: values.name,
        email: values.email,
        phone: values.phone,
        formula: values.formula,
        participants: values.participants,
        location: values.location,
        dates: values.dates,
        equipment: values.equipment,
        message: values.comment
      };

      const result = await formSubmissionService.submitForm(bookingData);

      if (result.success) {
        toast({
          title: "Demande envoyée avec succès !",
          description: "Nous reviendrons vers vous sous 48h ouvrées avec un devis personnalisé.",
        });
        form.reset();
        setCaptchaToken(null);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue lors de l'envoi",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const equipmentOptions = [
    "Sono (1 enceinte ou plus)",
    "Vidéoprojecteur",
    "Paperboard",
    "Imprimante avec consommables",
    "Connexion internet stable",
    "Ordinateur portable",
    "Table de mixage / Carte son",
    "Microphones",
    "Casques audio",
    "Écran TV / Moniteur",
    "Caméra / Appareil photo",
    "Éclairage",
    "Autre (à préciser dans le message)"
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="mb-6">Réservation / Contact</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Remplissez ce formulaire pour recevoir un devis personnalisé. Notre équipe reviendra vers vous sous 48h ouvrées.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">contact@letrousseau.fr</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Téléphone</h3>
                    <p className="text-muted-foreground">À venir</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Zone d'intervention</h3>
                    <p className="text-muted-foreground">Île-de-France</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary p-8 rounded-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la structure / parent ou jeune *</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom ou nom de la structure" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="votre@email.fr" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="formula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de formule *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une formule" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="initiation">À la carte (2h)</SelectItem>
                            <SelectItem value="cycle">Cycle complet</SelectItem>
                            <SelectItem value="modules">Modules à la carte</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="participants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de participants *</FormLabel>
                        <FormControl>
                          <Input type="number" min="5" max="10" placeholder="5 à 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse du lieu (ville + CP) *</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris 75001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date(s) souhaitée(s)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Indiquez vos préférences de dates..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commentaire</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Informations complémentaires, contraintes, objectifs spécifiques..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="equipment"
                    render={() => (
                      <FormItem>
                        <FormLabel>Matériel disponible sur site</FormLabel>
                        <p className="text-sm text-muted-foreground mb-3">
                          Cochez le matériel dont vous disposez déjà. Le Trousseau louera et ajoutera au devis le matériel manquant selon vos besoins.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {equipmentOptions.map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="equipment"
                              render={({ field }) => {
                                return (
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                      {item}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="leading-none">
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            J'accepte que mes données soient utilisées par Le Trousseau pour gérer cette demande et recevoir une réponse. *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Captcha onVerify={setCaptchaToken} />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting || !captchaToken}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
