import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../Utils/utils";
import { useParams } from "react-router-dom";

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 2,
    }}
  />
);
function Home() {
  const [menu, setmenu] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [restaurentDetails, setRestaurentDetails] = useState([]);
  const [resName, setResName] = useState("");
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState("");
  const [item, setItem] = useState([]);
  const [amount, setAmount] = useState(0);
  const [vat, setVat] = useState(0);
  const [totalButton, setTotalButton] = useState(true);
  const [totalbil, setTotalBil] = useState(0);

  // const [orderitem, setOrderItem] = useState([]);
  // const [counter, setCounter] = useState(1);
  const { res_id, table_id } = useParams();

  useEffect(() => {
    try {
      async function getResutrentData() {
        setIsloading(true);
        const { data } = await axios.get(`${URL}api/res/${res_id}/menu/`);
        if (data) {
          setmenu(data.data);
          setIsloading(false);
        }
      }
      async function getResturentDetails() {
        setIsloading(true);
        const { data } = await axios.get(`${URL}api/res/${res_id}`);
        setIsloading(false);
        if (data) {
          setRestaurentDetails(data.data);
          setResName(data.data.Restaurant_name);
        }
      }
      getResutrentData();
      getResturentDetails();
    } catch (error) {
      console.log(error);
    }
  }, [res_id]);
  const handleChange = ({ target: { checked, value } }) => {
    console.log(checked);
    // console.log(value);
    value = value.split(",");
    const itemObject = {
      item_name: value[0],
      item_id: value[1],
      item_price: value[2],
      counter: 1,
      total_price: value[2],
    };
    if (checked) {
      setItem([...item, itemObject]);
      // setOrderItem([...orderitem, orderItemObject]);
    } else {
      setTotal(total - Number(value[2]));
      // console.log("before check......", item);
      setItem(item.filter((i) => i.item_id !== itemObject.item_id));
      // console.log("after check......", item);
      // setOrderItem(item.filter((i) => i.item_id !== orderItemObject.item_id));
    }
  };
  function increment(item_id) {
    setTotalButton(true);
    let changeObject;
    item.map((i) => {
      if (i.item_id === item_id) {
        changeObject = i;
      }
    });
    let count = changeObject.counter + 1;
    let price = changeObject.item_price * count;
    const { counter, total_price, ...restPart } = changeObject;
    const modiFiedObject = {
      counter: count,
      total_price: price,
    };
    const finalobj = { ...modiFiedObject, ...restPart };
    console.log(finalobj);
    setAmount(0);
    // console.log("before removing item", item);
    const newItemArray = [];
    item.map((i) => {
      if (i.item_id === item_id) {
        newItemArray.push(finalobj);
      } else {
        newItemArray.push(i);
      }
    });
    setItem(newItemArray);
  }
  const decrement = (item_id) => {
    setTotalButton(true);
    let changeObject;
    item.map((i) => {
      if (i.item_id === item_id) {
        changeObject = i;
      }
    });
    if (changeObject.counter > 0) {
      let count = changeObject.counter - 1;
      let price = changeObject.item_price * count;
      const { counter, total_price, ...restPart } = changeObject;
      const modiFiedObject = {
        counter: count,
        total_price: price,
      };
      const finalobj = { ...modiFiedObject, ...restPart };
      console.log(finalobj);
      // console.log("before removing item", item);
      const newItemArray = [];
      item.map((i) => {
        if (i.item_id === item_id) {
          newItemArray.push(finalobj);
        } else {
          newItemArray.push(i);
        }
      });
      setItem(newItemArray);
    }
  };
  const generateBill = () => {
    let total = 0;
    item.map((perItem) => {
      total += Number(perItem.total_price);
    });
    setAmount(total);
    let vat = (total * 15) / 100;
    setVat(vat);
    setTotalBil(total + vat);
    setTotalButton(false);
  };
  const makeOrder = async () => {
    const orderItems = [];
    item.map((order) => {
      const localObject = {
        menu_id: order.item_id,
        quantity: order.counter,
        item_name: order.item_name,
      };
      orderItems.push(localObject);
    });
    const payload = {
      orderItems: orderItems,
    };
    // console.log(payload);
    const response = await axios.post(
      `${URL}api/res/${res_id}/table/${table_id}/order`,
      payload
    );
    setMsg(response.Message);
    window.location.reload();
  };
  return (
    <div className="container-fluid">
      {!isLoading ? (
        <>
          <div className="row pt-4">
            <div className="col-md-2 pt-5 mt-5">
              {/* {console.log(menu)} */}
              <p style={{ color: "red" }}>{resName}</p>
              <p style={{ color: "red" }}>{restaurentDetails.Address}</p>
            </div>
            <div className="col-md-8">
              <h1>
                Welcome to{" "}
                <sub>
                  <span style={{ color: "red" }}>{resName[0]}</span>
                  {resName.slice(1)}
                </sub>
              </h1>
            </div>
            <div className="col-md-2  pt-5 mt-5">
              <a href="!#" style={{ color: "red" }}>
                Show order details
              </a>
            </div>
          </div>
          <ColoredLine color="red" />
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                {menu.map((item) => (
                  <div className="col-md-3">
                    {/* {console.log(item.Item_name)} */}
                    <input
                      class="form-check-input pt-2 mt-2"
                      type="checkbox"
                      value={[item.Item_name, item._id, item.Price]}
                      id="flexCheckDefault"
                      onClick={handleChange}
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      <span style={{ fontSize: "140%" }}>
                        {" "}
                        {item.Item_name}
                      </span>
                    </label>
                    <p className="pt-4">
                      Qauntity: {item.Quantity} {item.Uom}
                    </p>
                    <p className="mb-4 pb-4">Price: {item.Price} Taka</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              {item.length > 0 && (
                <div class="card">
                  <div class="card-body">
                    <div className="div">
                      {/* <span>Your order</span> */}
                      {item.map((it, index) => (
                        <div>
                          <div className="row ml-2">
                            <div className="col-md-5 float-left">
                              {console.log(it)}
                              <p>
                                {index + 1} : {it.item_name}{" "}
                              </p>
                            </div>
                            <div className="col-md-7 float-right">
                              <button
                                className="btn btn-success pr-1 mr-1"
                                onClick={() => increment(it.item_id)}
                              >
                                +
                              </button>
                              {it.counter}
                              <button
                                className="btn btn-danger pl-1 ml-1 mr-1"
                                onClick={() => decrement(it.item_id)}
                              >
                                -
                              </button>
                              = {it.total_price} Tk
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-md-6">
                        {totalButton && (
                          <button
                            className="btn btn-success"
                            onClick={generateBill}
                          >
                            Calculate bill
                          </button>
                        )}
                      </div>
                      {!totalButton && (
                        <div className="col-md-6">
                          <p> Amount = {amount}</p>
                          <p>+15% VAT= {vat}</p>
                          <hr></hr>
                          <p>Total = {totalbil} Tk only</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {item.length > 0 && (
                <>
                  <div className="row">
                    <button
                      className="btn pl-5 ml-5 mt-2"
                      style={{ background: "orange" }}
                      onClick={makeOrder}
                    >
                      Order now
                    </button>
                    <p>{msg}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <p>Are you hungry? just wait.....</p>
        </>
      )}
    </div>
  );
}

export default Home;
