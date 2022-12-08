import Carousel from "react-bootstrap/Carousel";

const Rotator = () => {
  return (
    <Carousel>
      <Carousel.Item interval={3000}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/kitchenonthecorner-bfc5c.appspot.com/o/products%2Fchipotle-chicken-bbq-pizza%2Fimages%2Fbbq-pizza.jpg?alt=media&token=62cd5bca-8e44-4389-97d5-036a4b6f9fd7"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/kitchenonthecorner-bfc5c.appspot.com/o/products%2Fchipotle-chicken-bbq-pizza%2Fimages%2Fbbq-pizza.jpg?alt=media&token=62cd5bca-8e44-4389-97d5-036a4b6f9fd7"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={3000}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/kitchenonthecorner-bfc5c.appspot.com/o/products%2Fchipotle-chicken-bbq-pizza%2Fimages%2Fbbq-pizza.jpg?alt=media&token=62cd5bca-8e44-4389-97d5-036a4b6f9fd7"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Rotator;
