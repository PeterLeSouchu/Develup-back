import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
  cloud_name: 'deacf8wk3',
  api_key: '341553473999311',
  api_secret: 'ghbU6QoR8aggjUVs89_XKS_HqKk', // Click 'View API Keys' above to copy your API secret
});

// Upload an image
const uploadResult = await cloudinary.uploader
  .upload(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
    {
      public_id: 'shoes',
    }
  )
  .catch((error) => {
    console.log(error);
  });

const url = cloudinary.url('pexels-arts-1496373_xhkdu6', {
  transformation: [
    {
      fetch_format: 'auto',
    },
    { quality: 'auto' },
    {
      width: 1200,
    },
  ],
});

export default cloudinary;
