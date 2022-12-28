import 'bootstrap/dist/css/bootstrap.css'; //global css
import buildClient from '../api/build-client';
import Header from '../components/header';

//component is either going to be index or banana
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};

  //because sigin and signup pages don't have getInitialProps
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }
  console.log(data);
  return {
    pageProps,
    currentUser: data.currentUser
  };
};

export default AppComponent;
