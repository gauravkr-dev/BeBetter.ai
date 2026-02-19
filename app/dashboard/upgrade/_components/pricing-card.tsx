import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface PricingCardProps {
    price: number;
    features: string[];
    title: string;
    description?: string | null;
    priceSuffix?: string;
    buttonText: string;
    onClick: () => void;
}

export const PricingCard = ({ price, features, title, description, priceSuffix, buttonText, onClick }: PricingCardProps) => {
    return (
        <div className="">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="font-medium">{title}</CardTitle>
                    <span className="my-3 block text-2xl font-semibold">
                        {Intl.NumberFormat(
                            "en-US",
                            {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: 0,
                            }
                        ).format(price)}/{priceSuffix || "month"}

                    </span>
                    <CardDescription className="text-sm">{description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <hr className="border-dashed" />

                    <ul className="list-outside space-y-3 text-sm">
                        {features?.map((feature, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-2">
                                <Check className="size-3" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </CardContent>

                <CardFooter className="mt-auto">
                    <Button
                        variant="outline"
                        className="w-full cursor-pointer"
                        onClick={onClick}
                    >
                        {buttonText}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}