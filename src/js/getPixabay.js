import axios from "axios";

const APIKEY = '28443964-68fadfc1b5ff1bceef8020642';

const options = new UrlSearchOptions({
    q: 'cat',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
});

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.headers.common['Authorization'] = APIKEY;

export class GetPixabayApi {
    constructor(params) { }

    fetchImages() {
    axios.get('https://pixabay.com/api/', options)
    }
}