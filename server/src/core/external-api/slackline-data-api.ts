import axios from 'axios';

const _api = axios.create({
  baseURL: `https://raw.githubusercontent.com/International-Slackline-Association/slackline-data/master/data`,
});

export const slacklineDataApi = {};
