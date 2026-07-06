import FeatureAISeniorChat from "./feature-ai-senior-chat"
import FeatureInterviewAI from "./feature-interview"
import FeatureJobListings from "./feature-jobs-listings"
import FeatureMockTest from "./feature-mock-test"
import FeatureResumeAnalyzer from "./feature-resume-analyser"

export const FeaturesSection = () => {
    return (
        <section id="features" className="relative md:px-18 px-4 dark:bg-[#0A0A0A]">
            <FeatureInterviewAI />
            <FeatureMockTest />
            <FeatureResumeAnalyzer />
            <FeatureJobListings />
            <FeatureAISeniorChat />
        </section>
    )
}