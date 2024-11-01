import axios from 'axios';


export const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
  const apiKey = '433296206bd06af68412063ab';
  const url = `https://api.slpy.com/v1/search?level=${10}&lat=${latitude}&lon=${longitude}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const address = response.data.properties.address;
    return address;

  } catch (error) {
    console.error('Lỗi:', error);
  }
};
