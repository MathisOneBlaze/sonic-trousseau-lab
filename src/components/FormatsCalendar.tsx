import { Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FormatsCalendar = () => {
  const formats = [
    {
      title: "À la carte",
      duration: "1 séance de 2h",
      description: "Idéal événement / kick-off"
    },
    {
      title: "Cycle complet",
      duration: "6 séances × 4h + 2 journées",
      description: "1 jour studio + 1 jour tournage clip"
    }
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-12 text-center">Formats & calendrier</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {formats.map((format, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-6 h-6 text-primary" />
                    {format.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold mb-2">{format.duration}</p>
                  <p className="text-muted-foreground">{format.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-background border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Planning type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                1 séance / semaine (6 semaines) + studio et clip en semaines 7–8
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FormatsCalendar;
