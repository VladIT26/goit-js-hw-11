import './../css/styles.css';
import { Axios } from 'axios';
import { Notify } from 'notiflix';
import GetPixabayApi from './getPixabay';

const getPixabayApi = new GetPixabayApi();
GetPixabayApi.fetchImages();
