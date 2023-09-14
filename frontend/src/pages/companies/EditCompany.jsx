import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../config.js";
import { useSnackbar } from "notistack";
import phoneNumberValidator from "../../validation/phoneNumberValidator";
import emailValidator from "../../validation/emailValidator";
import startYearValidator from "../../validation/startYearValidator";

const EditCompany = () => {
  // TODO: [MERNSTACK-129] Add state for all companies fields that can be edited
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [startYear, setStartYear] = useState(0);
  const [loading, setLoading] = useState(false);

  // useNavigate is a hook that allows us to navigate to a different page
  const navigate = useNavigate();

  // useSnackbar is a hook that returns an object with two properties: enqueueSnackbar and closeSnackbar
  // enqueueSnackbar is a function that takes an object as an argument
  // and displays a snackbar with the message and the variant that we pass in the object
  // closeSnackbar is a function that takes an id as an argument and closes the snackbar with that id
  // https://iamhosseindhv.com/notistack/demos#use-snackbar
  const { enqueueSnackbar } = useSnackbar();

  // useEffect() is a hook that runs a function when the component is rendered
  useEffect(() => {
    setLoading(true);
    axios
      .get(BACKEND_URL + "/companies/" + id)
      .then((response) => {
        setLoading(false);
        const company = response.data;
        // TODO: [MERNSTACK-131] Set state for all companies fields that can be edited
        setName(company.name);
        setEmail(company.email);
        setPhone(company.phone);
        setStartYear(company.startYear);
      })
      .catch((error) => {
        setLoading(false);
        alert("Error fetching company, please check the console.");
        console.log(error);
      });
  }, []);

  // handleEditCompany is a function that sends a PUT request to the backend to update a company
  const handleEditCompany = () => {
    let invalidValues = false;

    if (companyNameValidator(name) === false) {
      enqueueSnackbar("Invalid company name!", { variant: "error" });
      console.log("Invalid company name" + name);
      invalidValues = true;
    }

    if (emailValidator(email) === false) {
      enqueueSnackbar("Invalid email!", { variant: "error" });
      console.log("Invalid email" + email);
      invalidValues = true;
    }

    if (phoneNumberValidator(phone, "NL") === false) {
      enqueueSnackbar("Invalid phone number!", { variant: "error" });
      console.log("Invalid phone number" + phone);
      invalidValues = true;
    }

    if (invalidValues) {
      return;
    }

    const data = {
      name: name,
      email: email,
      phone: phone,
      startYear: startYear,
    };
    setLoading(true);
    axios
      .put(BACKEND_URL + `/companies/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Company edited successfully!", { variant: "success" });
        navigate("/companies");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error editing company!", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="p-4">
      <BackButton destination={"/companies"} />
      <h1 className="text-3xl my-4">Edit Company</h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        {/* TODO: [MERNSTACK-130] Add input fields for all editable company details. To achieve this, copy the outer div with class ".my-4". */}
        {/* Comany Name input field */}
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Name</label>
          <input
            type="text"
            value={name}
            // onChange is a function that takes an event as an argument
            // and sets the title state to the value of the input
            // e.target.value is the value of the input
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        {/* Comany Email input field */}
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Email</label>
          <input
            type="text"
            value={email}
            // onChange is a function that takes an event as an argument
            // and sets the title state to the value of the input
            // e.target.value is the value of the input
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        {/* Comany Phone Number input field */}
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Phone</label>
          <input
            type="text"
            value={phone}
            // onChange is a function that takes an event as an argument
            // and sets the title state to the value of the input
            // e.target.value is the value of the input
            onChange={(e) => setPhone(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <button className="p-2 bg-sky-300 m-8" onClick={handleEditCompany}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditCompany;
