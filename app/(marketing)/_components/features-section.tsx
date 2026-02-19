import FeatureAISeniorChat from "./feature-ai-senior-chat"
import FeatureInterviewAI from "./feature-interview"
import FeatureJobListings from "./feature-jobs-listings"
import FeatureMockTest from "./feature-mock-test"
import FeatureResumeAnalyzer from "./feature-resume-analyser"

export const FeaturesSection = () => {
    return (
        <section id="features" className="relative md:px-18 px-4 dark:bg-[#0A0A0A]">
            <h1 className="absolute -top-10 left-0 w-full flex items-start justify-center
                 text-[60px] font-bold
                select-none pointer-events-none font-serif text-muted-foreground/10">
                FEATURES
            </h1>
            <FeatureInterviewAI />
            <FeatureMockTest />
            <FeatureResumeAnalyzer />
            <FeatureJobListings />
            <FeatureAISeniorChat />
        </section>
    )
}