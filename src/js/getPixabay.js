import axios from "axios";
const APIKEY = '28443964-68fadfc1b5ff1bceef8020642';

axios.defaults.baseURL = 'https://pixabay.com/api/';
// axios.defaults.headers.common['key'] = APIKEY;

export class GetPixabayApi {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchImages() {
        const options = new URLSearchParams({
            key: APIKEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            page: this.page,
            per_page: 40,
        })
        const { data } = await axios.get(`?${options}`);
        this.incrementPage();
        return data;
    }

    get searchQuery1() {
        return this.searchQuery;
    }

    set searchQuery1(newSearchQuery) {
        this.searchQuery = newSearchQuery
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
}