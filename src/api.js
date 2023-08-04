import axios from 'axios';

export async function getImages(keywordOfSearch) {
    const config = {
        url: 'https://pixabay.com/api/',
        params: {
            key: '38641927-f84485d6b228f5ae40ab4372b',
            q: keywordOfSearch,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        },
    };
    const response = await axios(config);
    return response.data.hits;
}
