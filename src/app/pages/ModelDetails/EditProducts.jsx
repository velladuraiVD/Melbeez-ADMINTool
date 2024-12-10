import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import {
    headerSortingClasses,
    toAbsoluteUrl,
} from "../../../_metronic/_helpers";
import {
    reqProdCategory,
    getProductModelPendingInfo,
    addProductInfo,
    getProductInputsById,
    deleteProductInfo,
    updateProduct,
    approveRejectProduct,
} from "../../services/configService";
import "./index.css";
import Cookie from "js-cookie";
import SVG from "react-inlinesvg";
import { Button, Modal, Form } from "react-bootstrap";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCategoriesData } from "../../../redux/Category/action";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "../../../Utility/toastMsg";
import TablePagination from "../../Components/TablePagination";
import { useEffect } from "react";
import { useFormik } from "formik";
import { charValidate } from "../../../Utility/commonFunctions";

export default function EditProducts({handleClose, show, productsData, productCategoryInputs}) {
    // console.log(handleClose, handleShow, productsData, productCategoryInputs)
    // console.log(handleShow)
    // console.log(productsData)
    // console.log(productCategoryInputs)
    const searchInputRef = useRef();
    const editFormRef = useRef();

    const [formParams, setFormParams] = useState({
        modelNumber: '',
        manufacturerName: '',
        productName: '',
        categoryName: '',
        others: '',
    });

    const [categoryName, setCategoryName] = useState([]);
    const [categoryInputs, setCategoryInputs] = useState([]);
    const [rowData, setRowData] = useState("");
    const [categoryNameOnSelection, setCategoryNameOnSelection] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        reqProdCategory(0, 100)
            .then((res) => res.json())
            .then((res) => {
                setCategoryName(res?.result);
            });
    }, []);
    
    const {
        values,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
    } = useFormik({
        initialValues: formParams,
        innerRef: editFormRef,
        validationSchema: "",
        onSubmit: (values, action) => {
            let allDynamicInputs = [];
            categoryInputs.map(e => {
                const field = {
                    ...e,
                    Value: values[e?.Field],
                };
                allDynamicInputs.push(field);
            });
            let bodyParams = {
                modelNumber: values?.modelNumber ?? "",
                manufacturerName: values?.manufacturerName ?? "",
                categoryName: categoryNameOnSelection ?? "",
                categoryId: values?.categoryName ?? "",
                productName: values?.productName ?? "",
                categoryType: values?.Type ?? "",
                automotiveType: values?.AutomotiveType ?? "",
                typeofLicence: values?.LicenseType ?? "",
                expiryDate: values?.ExpiryDate + "" ?? "",
                systemType: values?.SystemType ?? "",
                phoneOS: values?.PhoneOS ?? "",
                capacity: values.Capacity + "" ?? "",
                numberOfDoors: values?.NumberofDoors ?? "",
                screenSize: values?.ScreenSize ?? "",
                resolution: values.Resolution ?? "",
                manufactureYear: values?.ManufactureYear + "" ?? "",
                noiseLevel: values?.NoiseLevel ?? "",
                controlButtonPlacement: values?.ControlButtonPlacement ?? "",
                cookingPower: values?.CookingPower ?? "",
                description: values?.Description ?? "",
                formBuilderData: JSON.stringify(allDynamicInputs),
                otherInfo: values.others ?? "",
            };
            updateProduct(bodyParams, productsData?.id)
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    if (res?.status !== 400) {
                        dispatch(addCategoriesData(values));
                        showSuccessToast(res.message);
                        handleClose();
                        if (editFormRef && editFormRef.current) {
                            editFormRef.current.resetForm();
                        }
                    }
                })
                .catch((error) => {
                    showErrorToast("Unauthorized");
                });
        },
    });

    useEffect(() => {
        Cookie.remove("filterValue");
        let dymanicParams = {};
        if (productsData) {
            // let formattedOtherInfo = formatProductDetails(productsData?.otherInfo);
            setFieldValue("modelNumber", productsData?.modelNumber)
            setFieldValue("manufacturerName", productsData?.manufacturerName)
            setFieldValue("productName", productsData?.productName)
            setFieldValue("categoryName", productsData?.categoryId)
            setFieldValue("others", productsData?.otherInfo)
            for (let i = 0; i < categoryInputs?.length; i++) {
                const val = categoryInputs[i];
                const keys = Object.keys(val);
                editFormRef?.current && editFormRef.current.setFieldValue(val?.Field, val?.Value);
                dymanicParams[val?.Field] = val?.Value;
                setFieldValue(val?.Field, val?.Value)
            }
            setFormParams(dymanicParams);
        }
    }, [productsData?.id])

    const handleCategoryChange = (e) => {
        handleChange(e);
        let categoryId = e.target.value;
        let categoryName = e.target.options[e.target.selectedIndex].textContent;
        setCategoryNameOnSelection(categoryName)
        getProductInputsById(categoryId)
            .then((result) => result.json())
            .then((result) => {
                let arr = JSON.parse(result?.result[0]?.formBuilderData);
                if(arr && arr?.length) {
                    arr.map((data) => {
                        setFieldValue(data?.Field, data?.Value);
                    })
                }
                setCategoryInputs(JSON.parse(result?.result[0]?.formBuilderData));
            })
            .catch((error) => {
                // console.error("Error:", error);
            });
    };

   
    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        return `${year}`;
    };


    return (
        <>
            {/* -----  Edit Modal ---- */}
            <Modal
                show={show}
                onHide={handleClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Product Details</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div style={{
                            display: "inline-block",
                            width: "48%",
                            marginRight: "8px",
                        }}>
                            <Form.Label>Manufacturer Name</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="off"
                                disabled
                                placeholder="Manufacture Name"
                                name="manufacturerName"
                                // onChange={handleChange}
                                value={values?.manufacturerName}
                                onBlur={handleBlur}
                                className="mb-3"
                                required
                            />
                        </div>
                        <div style={{
                            display: "inline-block",
                            width: "48%",
                            marginRight: "8px",
                        }}>
                            <Form.Label>Model Number</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="off"
                                placeholder="Model Number"
                                name="modelNumber"
                                onChange={handleChange}
                                value={values?.modelNumber}
                                onBlur={handleBlur}
                                className="mb-3"
                                required
                            />
                        </div>
                        <div style={{
                            display: "inline-block",
                            width: "48%",
                            marginRight: "8px",
                        }}>
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                autoComplete="off"
                                placeholder="Product Name"
                                name="productName"
                                onChange={handleChange}
                                value={values?.productName}
                                onBlur={handleBlur}
                                className="mb-3"
                                required
                            />
                        </div>
                        <br />
                        <Form.Label>Category Name</Form.Label>
                        <br />
                        <select
                            className="mb-3 mr-2"
                            onChange={handleCategoryChange}
                            name="categoryName"
                            value={values?.categoryName}
                            style={{ width: "100%", height: "33px" }}
                            required
                        >
                            <option>Select Category</option>
                            {categoryName?.map((category, index) => (
                                <>
                                    <option key={index} value={category?.categoryId}>
                                        {category?.categoryName}
                                    </option>
                                </>
                            ))}
                        </select>
                        {categoryInputs?.map((input, index) => {
                            return (
                                <>
                                    {input?.Type === "Dropdown" && (
                                        <>
                                            <Form.Label>{input?.Placeholder}</Form.Label><br />
                                            <select
                                                className="mb-3"
                                                style={{ width: "100%", height: "33px" }}
                                                name={input?.Field}
                                                onChange={handleChange}
                                                value={values[input?.Field]}
                                                onBlur={handleBlur}
                                                required
                                            >
                                                <option>Category Type</option>
                                                {input?.DropdownData?.map((item, index) => (
                                                    <>
                                                        <option key={index} value={item?.Id}>
                                                            {item?.Value}
                                                        </option>
                                                    </>
                                                ))}
                                            </select>
                                        </>
                                    )}
                                    {input?.Type === "Text" && (
                                        <>
                                            <div style={{
                                                display: "inline-block",
                                                width: "48%",
                                                marginRight: "8px",
                                            }}>
                                                <Form.Label>{input?.Field}</Form.Label>
                                                {input.Field === "Capacity" &&
                                                    <>
                                                        <span>&nbsp;</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFA500" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                            <title>Only accepts numbers</title>
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                        </svg>
                                                    </>
                                                }
                                                <Form.Control
                                                    type={input.Field === "Capacity" ? "number" : "text"}
                                                    autoComplete="off"
                                                    onChange={handleChange}
                                                    name={input?.Field}
                                                    value={values[input?.Field]}
                                                    onBlur={handleBlur}
                                                    placeholder={input?.Placeholder}
                                                    className="mb-3"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                    {input?.Type === "DateTime" && (
                                        <>
                                            <div style={{
                                                display: "inline-block",
                                                width: "48%",
                                                marginRight: "8px",
                                            }}>
                                                <Form.Label>{input?.Field}</Form.Label><br />
                                                <Form.Control
                                                    type="date"
                                                    autoComplete="off"
                                                    placeholder={input?.Placeholder}
                                                    onChange={handleChange}
                                                    name={input?.Field}
                                                    value={values?.input?.Field}
                                                    onBlur={handleBlur}
                                                    className="mb-3"
                                                />
                                            </div>
                                        </>
                                    )}
                                    {input?.Type === "Number" && (
                                        <>
                                            <div style={{
                                                display: "inline-block",
                                                width: "48%",
                                                marginRight: "8px",
                                            }}>
                                                <Form.Label>{input?.Placeholder}</Form.Label>
                                                &nbsp;<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFA500" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                    <title>Accept only four-digit numbers and ensure that the date provided is not in the future.</title>
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                </svg><br />
                                                <Form.Control
                                                    type="number"
                                                    autoComplete="off"
                                                    placeholder={input?.Placeholder}
                                                    onChange={handleChange}
                                                    name={input?.Field}
                                                    value={values[input?.Field]}
                                                    onBlur={handleBlur}
                                                    className="mb-3"
                                                    min="0"
                                                    required
                                                    onInput={(e) => {
                                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                                                    }}
                                                    max={getCurrentDate()}
                                                />
                                            </div><br />
                                        </>
                                    )}
                                    {input?.Type === "TextArea" && (
                                        <>
                                            <Form.Label>{input?.Placeholder}</Form.Label><br />
                                            <Form.Control
                                                as="textarea"
                                                placeholder={input?.Placeholder}
                                                rows={3}
                                                className="mb-3"
                                                onChange={handleChange}
                                                value={values[input?.Field]}
                                                name={input?.Field}
                                                required
                                                onBlur={handleBlur}
                                            />
                                        </>
                                    )}
                                </>
                            );
                        })}
                        <Form.Label>Others</Form.Label><br />
                        <Form.Control
                            as="textarea"
                            placeholder="Other Info {Input must be Key: Value; pair (ex. Name:John;)}"
                            rows={3}
                            className="mb-3"
                            onChange={handleChange}
                            name="others"
                            value={values?.others}
                            onBlur={handleBlur}
                        />
                        <hr />
                        <div style={{ display: "flex", justifyContent: "end" }}>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    handleClose();
                                }}
                            >
                                Close
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: "#FACD21",
                                    border: "none",
                                    color: "black",
                                    marginLeft: 2,
                                }}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </Modal.Body>
                </Form>
            </Modal>
        </>
    );
}
