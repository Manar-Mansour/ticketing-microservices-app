import axios from 'axios';
//create a preconfigured version of axios based on whether we are in the browser or server
export default ({ req }) => {
  if (typeof window === 'undefined') {
    //we are on the server
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    //we must be on the browser
    //the browser will set the headers for us, we don't even need to set a baseURL
    return axios.create({
      baseURL: '/'
    });
  }
};
