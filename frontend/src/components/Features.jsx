import featureImg1 from '../assets/feature-verified.png';
import featureImg2 from '../assets/feature-ontime.png';
import featureImg3 from '../assets/feature-pricing.png';

const FeatureCard = ({ image, title, description }) => (
  <div className="card bg-base-100 shadow-lg text-center overflow-hidden">
    <figure>
      <img src={image} alt={title} className="w-16 h-16 mb-4" />
    </figure>
    <div className="card-body">
      <h2 className="card-title justify-center font-display">{title}</h2>
      <p className="text-secondary/70">{description}</p>
    </div>
  </div>
);

const Features = () => {
  const featureData = [
    {
      image: featureImg1,
      title: "Verified Professionals",
      description: "We partner with skilled & vetted experts to ensure top-quality service."
    },
    {
      image: featureImg2,
      title: "On-Time & Efficient",
      description: "Book a slot that works for you. We value your time and guarantee punctuality."
    },
    {
      image: featureImg3,
      title: "Transparent Pricing",
      description: "No hidden fees. Know the price upfront before you book any service."
    }
  ];

  return (
    <div className="bg-neutral/50 -mx-4 px-4 py-16 md:py-24">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-secondary">Why Choose ServicePro?</h2>
            <p className="text-lg mt-4 max-w-2xl mx-auto text-secondary/60">
                We are committed to providing a seamless and reliable experience for all your home service needs in Lucknow.
            </p>
        </div>
        <div className="container mx-auto">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {featureData.map(feature => <FeatureCard key={feature.title} {...feature} />)}
            </div>
        </div>
    </div>
  );
};

export default Features;