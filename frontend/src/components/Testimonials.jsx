const TestimonialCard = ({ quote, name, service, rating }) => (
  <div className="card bg-base-100 shadow-lg">
    <div className="card-body">
      <div className="rating rating-sm mb-2">
        {[...Array(5)].map((_, i) => (
          <input key={i} type="radio" name={`rating-${name}`} className="mask mask-star-2 bg-orange-400" defaultChecked={i < rating} disabled />
        ))}
      </div>
      <p className="text-secondary/80">"{quote}"</p>
      <div className="card-actions justify-end mt-4">
        <div className="text-right">
          <p className="font-bold font-display text-secondary">{name}</p>
          <p className="text-sm text-secondary/60">{service}</p>
        </div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const testimonialData = [
    { rating: 5, quote: "The cleaning service was impeccable! My apartment has never looked this good. The professional was on time and very thorough.", name: "Priya Sharma", service: "Deep Home Cleaning" },
    { rating: 5, quote: "My AC wasn't working in the middle of a heatwave. ServicePro sent someone within hours and fixed it quickly. A real lifesaver!", name: "Amit Singh", service: "AC Repair" },
    { rating: 4, quote: "Great painting job on my living room. The finish is excellent. It took a little longer than expected, but the result was worth it.", name: "Sunita Verma", service: "Interior Painting" },
  ];

  return (
    <div className="bg-base-100 -mx-4 px-4 py-16 md:py-24">
      <div className="container mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-secondary">What Our Clients Say</h2>
            <p className="text-lg mt-4 max-w-2xl mx-auto text-secondary/60">Real stories from satisfied customers in Lucknow.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonialData.map(t => <TestimonialCard key={t.name} {...t} />)}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;