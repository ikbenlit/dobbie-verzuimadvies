import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Clock, 
  Shield, 
  CheckCircle, 
  Lightbulb,
  Users,
  MessageSquare,
  Smartphone,
  TrendingUp
} from "lucide-react";
import dobbieImage from "@/assets/dobbie-ai.jpg";

const DobbieSection = () => {
  const dobbieFeatures = [
    {
      icon: Bot,
      title: "AI-gedreven advies",
      description: "Intelligente analyses gebaseerd op Nederlandse wetgeving en medische consensus"
    },
    {
      icon: Clock,
      title: "24/7 beschikbaar",
      description: "Directe ondersteuning wanneer u het nodig heeft, ook buiten kantooruren"
    },
    {
      icon: Shield,
      title: "Juridisch onderbouwd",
      description: "Alle adviezen gebaseerd op geldende Nederlandse wet- en regelgeving"
    },
    {
      icon: Users,
      title: "Mensgerichte benadering",
      description: "Focus op empathische communicatie en verbindend leiderschap"
    }
  ];

  const benefits = [
    { percentage: "75%", label: "Tijdsbesparing", description: "Van uren zoeken naar minuten directe adviezen" },
    { percentage: "40%", label: "Meer succes", description: "Verhoogd re-integratiesucces door evidence-based aanpak" },
    { percentage: "90%", label: "Minder risico's", description: "Voorkom juridische problemen door correct handelen" }
  ];

  const targetGroups = [
    { icon: Users, title: "Leidinggevenden", description: "Zelfverzekerd verzuimgesprekken voeren" },
    { icon: MessageSquare, title: "HR-professionals", description: "Professionele ondersteuning bij complex verzuim" },
    { icon: TrendingUp, title: "Ondernemers", description: "Efficiënt verzuimbeleid zonder externe expertise" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary/20 text-secondary hover:bg-secondary/30">
            Binnenkort beschikbaar
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Maak kennis met <span className="text-primary">DOBbie</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            De intelligente AI-assistent voor verzuimmanagement. Eerste hulp bij verzuim, 
            direct in uw broekzak. Ontwikkeld door een bedrijfsarts, speciaal voor Nederlandse organisaties.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-slide-in">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">DOBbie AI-assistent</h3>
                <p className="text-muted-foreground">Eerste hulp bij verzuim</p>
              </div>
            </div>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                DOBbie is niet zomaar een chatbot. Het is een specialistische AI-assistent 
                die ik heb ontwikkeld om leidinggevenden, HR-professionals en ondernemers 
                direct te ondersteunen bij verzuimgesprekken en re-integratietrajecten.
              </p>
              <p>
                Gebaseerd op jarenlange expertise in bedrijfsgeneeskunde en toegespitst op 
                de Nederlandse context, biedt DOBbie concrete, juridisch onderbouwde adviezen 
                wanneer u die het meest nodig heeft.
              </p>
              <p>
                Of het nu gaat om een eerste ziekmelding, een lastig re-integratiegesprek of 
                complexe verzuimproblematiek - DOBbie helpt u de juiste stappen te zetten.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Probeer DOBbie binnenkort
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
              >
                Meer informatie aanvragen
              </Button>
            </div>
          </div>

          <div className="animate-fade-in">
            <Card className="overflow-hidden shadow-gold">
              <div className="relative">
                <img 
                  src={dobbieImage} 
                  alt="DOBbie AI Assistant" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">DOBbie Online</span>
                  </div>
                  <p className="text-xs opacity-90">Klaar om u te helpen met verzuimadvies</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {dobbieFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-medium transition-all duration-300 border-border animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <h4 className="font-semibold mb-2 text-card-foreground">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <Card className="mb-16 bg-gradient-card shadow-soft border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-card-foreground">
              Bewezen resultaten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {benefit.percentage}
                  </div>
                  <div className="text-lg font-semibold text-card-foreground mb-2">
                    {benefit.label}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Target Groups */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4 text-foreground">
            Voor wie is DOBbie bedoeld?
          </h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {targetGroups.map((group, index) => (
            <Card 
              key={index} 
              className="hover:shadow-medium transition-all duration-300 border-border animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <group.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-card-foreground">
                  {group.title}
                </h4>
                <p className="text-muted-foreground">
                  {group.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="bg-primary/5 border-primary/20 shadow-soft">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Lightbulb className="w-8 h-8 text-secondary mr-3" />
              <h3 className="text-2xl font-bold text-foreground">
                Interesse in DOBbie?
              </h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              DOBbie komt binnenkort online. Meld u aan voor early access en 
              blijf op de hoogte van de laatste ontwikkelingen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Houd mij op de hoogte
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Plan een demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DobbieSection;