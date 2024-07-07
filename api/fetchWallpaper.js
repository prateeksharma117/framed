import axios from "axios";

const apiKey = "28811169-adcc007dce47b1f3409e45818";
const apiUrl = `https://pixabay.com/api/?key=${apiKey}`;

const formatUrl = (params) => {
  let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true";
  if (!params) return url;
  let paramsKey = Object.keys(params);
  paramsKey.map((key) => {
    let value = key == "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  return url;
};

export const apiCall = async (params) => {
  try {
    const response = await axios.get(formatUrl(params));
    const { data } = response;
    return { success: true, data };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};
