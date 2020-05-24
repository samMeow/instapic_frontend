import APIFetcher from 'utils/APIFetcher';

const { REACT_APP_INSTAPIC_API_URL } = process.env;

export default class InstaPicFetcher extends APIFetcher {
  baseURL = REACT_APP_INSTAPIC_API_URL || '';
}
