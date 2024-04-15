"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faEnvelope,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import RootLayout from "./layout";
import axios from "axios"; // Import Axios for fetching data
import Image from "next/image";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Button } from "react-bootstrap";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled } from "@mui/material/styles";
// This function is used to format the value label displayed by the slider.
function valuetext(value) {
  return `${value}$`;
}
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
const CartItems = ({ cart, removeFromCart }) => {
  if (cart.length === 0)
    return <p className="card-items">No items in the cart.</p>;

  return (
    <>
      <ul className="card-items mt-5 p-5" style={{ boxShadow: "0 0 2px #ccc" }}>
        {cart.map((item) => (
          <li
            key={item.id}
            className="mb-3 text-left d-flex justify-content-between"
          >
            <img src={item.img} width="30" alt="" />{" "}
            <p className="my-auto">
              {item.name} - ${item.price} <b>x {item.qty}</b>
            </p>
            <Button
              variant="danger"
              className="btn ms-3 p-2 my-auto bg-danger"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </Button>
          </li>
        ))}
        <li>
          <Button
            variant="success"
            className="d-block mx-auto text-center mt-30 bg-success"
          >
            checkout
          </Button>
        </li>
      </ul>
    </>
  );
};
export default function Page() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [cart, setCart] = useState([]);
  const [show, setShow] = useState(false);

  // Fetch the items data from the public directory via an HTTP request asp task request
  useEffect(() => {
    axios
      .get("/data/items.json")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Failed to fetch items:", error));
  }, []);
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((x) => x.id === item.id);
      if (exist) {
        return prev.map((x) =>
          x.id === item.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) =>
      prev.reduce((acc, item) => {
        if (item.id === id) {
          if (item.qty === 1) return acc;
          return [...acc, { ...item, qty: item.qty - 1 }];
        }
        return [...acc, item];
      }, [])
    );
  };
  // Filtering and sorting logic
  // const filteredItems = items
  //   .filter((item) =>
  //     item.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   .sort((a, b) => {
  //     if (sortKey === "name") {
  //       return a.name.localeCompare(b.name);
  //     } else if (sortKey === "price") {
  //       return a.price - b.price;
  //     }
  //     return 0;
  //   });

  const filteredItems = items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        item.price >= priceRange[0] &&
        item.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortKey === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortKey === "price") {
        return a.price - b.price;
      }
      return 0;
    });
  return (
    <RootLayout>
      <header className="container col-12 d-flex justify-content-between">
        <img src="e2e.png" alt="logo" width="100" />
        <div className="card-container">
          <IconButton
            aria-label="cart"
            onClick={() => setShow(!show)}
            className="mt-10"
          >
            <StyledBadge badgeContent={cart.length} color="secondary">
              <ShoppingCartIcon />
            </StyledBadge>
          </IconButton>
          <div style={{ display: show ? "block" : "none" }}>
            {" "}
            <CartItems cart={cart} removeFromCart={handleRemoveFromCart} />
          </div>
        </div>{" "}
      </header>

      <div className="container mt-5">
        <div className="col-12 col-lg-10 mx-auto">
          <input
            type="text"
            className="form-control mb-50"
            placeholder="Search by name..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="col-12 mx-auto d-flex flex-column flex-lg-row justify-content-between">
            <div className="d-flex py-25  ">
              <button
                className="btn btn-secondary me-2  "
                onClick={() => setSortKey("name")}
              >
                Sort by Name
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setSortKey("price")}
              >
                Sort by Price
              </button>
            </div>

            <div className="d-flex flex-column flex-lg-row justify-content-lg-between">
              <p className="pb-50 pb-xs-0 pt-xs-30">Min Price: 0$</p>
              <Box sx={{ width: 300, margin: "auto" }}>
                <Slider
                  getAriaLabel={() => "Price range"}
                  value={priceRange}
                  onChange={(event, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                  min={0}
                  max={30}
                />
              </Box>
              <p className="pb-50">Max Price: 30$</p>
            </div>
          </div>
        </div>
        <ul className="list-group   mt-3 col-12 col-lg-10 mx-auto">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className="col-12 list-group-item flex-column flex-lg-row align-items-center p-0 d-flex justify-content-between "
            >
              <div style={{ borderRight: "1px solid #ccc" }}>
                <img src={item.img} alt={item.name} width="200" />
              </div>
              <div className="col-6 my-auto   text-left">
                {" "}
                <h5>{item.name}</h5>
                <p>{item.description}</p>
                <p className="d-flex justify-content-lg-end pt-3 pb-3 pb-lg-0 fs-1">
                  <strong>${item.price}</strong>
                </p>
              </div>
              <Button
                className="py-3 mr-10"
                onClick={() => handleAddToCart(item)}
              >
                Add to Cart
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <footer className="main footer-dark">
        <section className="newsletter mb-15 wow animate__animated animate__fadeIn">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="position-relative newsletter-inner">
                  <div className="newsletter-content">
                    <h2 className="mb-20">Best Ecommerce Product</h2>
                    <p className="mb-50">Best Ecommerce Product</p>
                    <form className="form-subcriber d-flex">
                      <input type="hidden" />{" "}
                      <input
                        type="email"
                        placeholder="Your emaill address"
                        required=""
                        name="email"
                      />
                      <button className="btn" type="submit">
                        Subscribe
                      </button>
                    </form>
                  </div>
                  <img
                    src="../upload/banner/1766569978974370.png"
                    alt="footer banner"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="featured section-padding">
          <div className="container">
            <div className="row">
              <div className="col-xl-1-5 col-md-4 col-12 col-sm-6 mb-md-4 mb-xl-0">
                <div
                  className="banner-left-icon d-flex align-items-center wow animate__animated animate__fadeInUp"
                  data-wow-delay="0"
                >
                  <div className="banner-icon">
                    <img
                      src="../frontend/assets/imgs/theme/icons/i-1.png"
                      alt="best prices"
                    />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Best prices & offers</h3>
                    <p>Orders $50 or more</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-1-5 col-md-4 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center wow animate__animated animate__fadeInUp"
                  data-wow-delay=".1s"
                >
                  <div className="banner-icon">
                    <img
                      src="../frontend/assets/imgs/theme/icons/i-2.png"
                      alt="free delivery"
                    />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Free delivery</h3>
                    <p>24/7 amazing services</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-1-5 col-md-4 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center wow animate__animated animate__fadeInUp"
                  data-wow-delay=".2s"
                >
                  <div className="banner-icon">
                    <img
                      src="../frontend/assets/imgs/theme/icons/i-3.png"
                      alt="great daily deal"
                    />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Great daily deal</h3>
                    <p>When you sign up</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-1-5 col-md-4 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center wow animate__animated animate__fadeInUp"
                  data-wow-delay=".3s"
                >
                  <div className="banner-icon">
                    <img
                      src="../frontend/assets/imgs/theme/icons/i-4.png"
                      alt=""
                    />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Wide assortment</h3>
                    <p>Mega Discounts</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-1-5 col-md-4 col-12 col-sm-6">
                <div
                  className="banner-left-icon d-flex align-items-center wow animate__animated animate__fadeInUp"
                  data-wow-delay=".4s"
                >
                  <div className="banner-icon">
                    <img
                      src="../frontend/assets/imgs/theme/icons/i-5.png"
                      alt=""
                    />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Easy returns</h3>
                    <p>Within 30 days</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-1-5 col-md-4 col-12 col-sm-6 d-xl-none">
                <div
                  className="banner-left-icon d-flex align-items-center wow animate__animated animate__fadeInUp"
                  data-wow-delay=".5s"
                >
                  <div className="banner-icon">
                    <img
                      src="../frontend/assets/imgs/theme/icons/i-6.png"
                      alt=""
                    />
                  </div>
                  <div className="banner-text">
                    <h3 className="icon-box-title">Safe delivery</h3>
                    <p>Within 30 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-padding footer-mid dark-section main-footer-custom">
          <div className="container pt-15 pb-20">
            <div className="row">
              <div className="col-md-4 col-sm-6 col-12">
                <div
                  className="widget-about font-md mb-md-3 mb-lg-3 mb-xl-0 wow animate__animated animate__fadeInUp"
                  data-wow-delay="0"
                >
                  <div className="logo mb-30">
                    <a href="#." className="mb-15">
                      <img src="e2e.png" alt="E2E Logo" width="100" />
                    </a>
                    <ul className="contact-infor">
                      <li>
                        <h4 className="widget-title">Install App</h4>
                        <p className="">From App Store or Google Play</p>
                        <div className="download-app">
                          <a href="#." className="hover-up mb-sm-2">
                            <img
                              src="../frontend/assets/imgs/theme/google-play.jpg"
                              alt=""
                            />
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-sm-6 col-12">
                <div className="row justify-content-between">
                  <div className="col-sm-6 col-md-3 col-12">
                    <div
                      className="footer-link-widget wow animate__animated animate__fadeInUp"
                      data-wow-delay=".2s"
                    >
                      <h4 className="widget-title">Account</h4>
                      <ul className="footer-list mb-sm-5 mb-md-0">
                        <li>
                          <a href="#.">Sign In</a>
                        </li>
                        <li>
                          <a href="#.">View Cart</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3 col-12">
                    <div
                      className="footer-link-widget wow animate__animated animate__fadeInUp"
                      data-wow-delay=".1s"
                    >
                      <h4 className="widget-title">Company</h4>
                      <ul className="footer-list mb-sm-5 mb-md-0">
                        <li>
                          <a href="#.">About us</a>
                        </li>
                        <li>
                          <a href="#.">Return Policy</a>
                        </li>
                        <li>
                          <a href="#.">Support &amp; Policy</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="ms-xl-auto col-md-5 col-12 mr-0 d-sm-none d-md-block">
                    <div
                      className="footer-link-widget wow animate__animated animate__fadeInUp"
                      data-wow-delay=".1s"
                    >
                      <h4 className="widget-title">CONTACT INFO</h4>
                      <ul className="contact-infor">
                        <li>
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            className="me-2 text-white"
                          />
                          <strong>Address: </strong> <span>Cairo,Egypt</span>
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faPhone}
                            className="me-2 text-white"
                          />

                          <strong>Call Us: </strong>
                          <a href="tel:(+02) 10 907 23497">
                            (+02) 10 907 23497
                          </a>
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="me-2 text-white"
                          />
                          <strong>Email: </strong>
                          <a href="mailto:ahmed.mostafa@titegypt.com">
                            ahmed.mostafa@titegypt.com
                          </a>
                        </li>
                        <li>
                          <FontAwesomeIcon
                            icon={faClock}
                            className="me-2 text-white"
                          />
                          <strong>Hours:</strong>
                          <span> 10:00 - 8:00, Sa - Thu</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 mr-0 d-sm-block d-md-none">
                <div
                  className="footer-link-widget wow animate__animated animate__fadeInUp"
                  data-wow-delay=".1s"
                >
                  <h4 className="widget-title">CONTACT INFO</h4>
                  <ul className="contact-infor">
                    <li>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="me-2 text-white"
                      />
                      <strong>Address: </strong> <span>Cairo,Egypt</span>
                    </li>
                    <li>
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="me-2 text-white"
                      />
                      <strong>Call Us: </strong>
                      <a href="tel:(+02) 10 907 23497">(+02) 10 907 23497</a>
                    </li>
                    <li>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="me-2 text-white"
                      />
                      <strong>Email: </strong>
                      <a href="mailto:ahmed.mostafa@titegypt.com">
                        ahmed.mostafa@titegypt.com
                      </a>
                    </li>
                    <li>
                      <FontAwesomeIcon
                        icon={faClock}
                        className="me-2 text-white"
                      />
                      <strong>Hours:</strong>
                      <span> 10:00 - 8:00, Sa - Thu</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          className="pb-30 wow animate__animated animate__fadeInUp dark-section"
          data-wow-delay="0"
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 mb-30">
                <div className="footer-bottom"></div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6">
                <p className="font-sm mb-0">
                  Copyright © 20243. All Rights Reserved By{" "}
                  <a href="">Ahmed Mostafa</a>
                </p>
              </div>
              <div className="col-xl-4 col-lg-6 text-center d-none d-xl-block">
                <div className="mobile-social-icon justify-content-center">
                  <h6>Follow Us</h6>
                  <a href="#">
                    <img
                      src="../frontend/assets/imgs/theme/icons/icon-facebook-white.svg"
                      alt=""
                    />
                  </a>
                  <a href="#">
                    <img
                      src="../frontend/assets/imgs/theme/icons/icon-twitter-white.svg"
                      alt=""
                    />
                  </a>
                  <a href="#">
                    <img
                      src="../frontend/assets/imgs/theme/icons/icon-instagram-white.svg"
                      alt=""
                    />
                  </a>
                  <a href="#">
                    <img
                      src="../frontend/assets/imgs/theme/icons/icon-pinterest-white.svg"
                      alt=""
                    />
                  </a>
                  <a href="#">
                    <img
                      src="../frontend/assets/imgs/theme/icons/icon-youtube-white.svg"
                      alt=""
                    />
                  </a>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6 text-end d-none d-md-block">
                <a href="#">
                  <img
                    className=""
                    src="../frontend/assets/imgs/theme/payment-method.png"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </RootLayout>
  );
}
