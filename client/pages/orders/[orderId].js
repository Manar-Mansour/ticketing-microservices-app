//We're going to make use of the use effect hook as well to
//make sure that we only attempt to set the interval up exactly one time.
import { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  });
  // so to make sure that I run this function only one
  //time when the component is first displayed on the screen.
  //I'm going to put in an empty array like so []
  //Whenever we return a function from user effect, that function will be invoked if we are about to navigate
  //away from this component or if the component is going to be re-rendered
  //it's only going to call it if the component is about to be re-rendered,
  //if we have a dependency listed inside of this array right here, but since we have an empty array,
  //this function is only going to be called if we navigate away or stop showing this component

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft(); //invoke it immediatelly before waiting for one second
    //make sure to call this fn every second
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId); //to make sure we clear the interval once we navigate away from this component
    };
  }, []);
  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  //the stripeKey will be an environment variable in Next
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51MIBIXCp9XMqHneaFxgpP771r50nFyElat74KvuLtxBcbZNVITG7ySKEPiOfH5GaJWaFc9F3wByO8S0zgfT52mRy002Zd7o2ou"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};
export default OrderShow;
