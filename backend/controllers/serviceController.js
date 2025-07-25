import Service from '../models/Service.js';

export const createService = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;
  try {
    const newService = new Service({
      name,
      description,
      price,
      category,
      imageUrl,
      provider: req.user.id,
    });
    const service = await newService.save();
    res.status(201).json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user.id });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};