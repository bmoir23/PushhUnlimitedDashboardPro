import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dashboard } from "@/components/ui/dashboard";
import { useAuth } from "@/hooks/use-auth";

interface PlanFeature {
  title: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  recommended?: boolean;
  buttonText: string;
}

export default function Upgrade() {
  const [, setLocation] = useLocation();
  const { userPlan } = useAuth();

  const plans: Plan[] = [
    {
      name: "Free",
      price: "$0",
      description: "Basic features for personal use",
      features: [
        { title: "Dashboard access", included: true },
        { title: "Limited integrations", included: true },
        { title: "Basic analytics", included: true },
        { title: "Community support", included: true },
        { title: "AI-powered tools", included: false },
        { title: "Advanced monitoring", included: false },
      ],
      buttonText: userPlan === "free" ? "Current Plan" : "Downgrade"
    },
    {
      name: "Basic",
      price: "$19",
      description: "Essential features for small teams",
      recommended: true,
      features: [
        { title: "Everything in Free", included: true },
        { title: "Unlimited integrations", included: true },
        { title: "Advanced analytics", included: true },
        { title: "Priority support", included: true },
        { title: "Basic AI-powered tools", included: true },
        { title: "Team collaboration", included: false },
      ],
      buttonText: userPlan === "basic" ? "Current Plan" : "Upgrade"
    },
    {
      name: "Premium",
      price: "$49",
      description: "Advanced features for growing teams",
      features: [
        { title: "Everything in Basic", included: true },
        { title: "Advanced AI capabilities", included: true },
        { title: "Custom integrations", included: true },
        { title: "Advanced monitoring", included: true },
        { title: "Dedicated support", included: true },
        { title: "Enterprise-grade security", included: true },
      ],
      buttonText: userPlan === "premium" ? "Current Plan" : "Upgrade"
    }
  ];

  return (
    <Dashboard>
      <div className="py-10 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the plan that best suits your needs and unlock powerful features for your team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col ${plan.recommended ? 'border-primary shadow-md' : ''}`}
            >
              {plan.recommended && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Recommended
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle 
                        className={`h-5 w-5 mr-2 ${feature.included ? 'text-primary' : 'text-muted-foreground/30'}`} 
                      />
                      <span className={feature.included ? '' : 'text-muted-foreground'}>{feature.title}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={userPlan === plan.name.toLowerCase() ? "outline" : "default"}
                  disabled={userPlan === plan.name.toLowerCase()}
                  onClick={() => {
                    // This would typically redirect to a payment page or subscription management
                    alert("This would redirect to a payment processor in a production environment");
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" onClick={() => setLocation("/")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </Dashboard>
  );
}