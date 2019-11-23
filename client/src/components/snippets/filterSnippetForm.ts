import React from "react";
import { State, Team, Teams } from "../../store/types";
import { connect } from "react-redux";
import { fetchSnippets, fetchUser } from "../../store/actions";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";

// TODO:
// 1. Populate user names (values as userID) for a drop-down
// 2. Populate current week, can go from 1-52

interface FilterSnippetFormProps {
  fetchSnippets: (filter?: any) => void;
  users: any;
  week: any;
}

// Validate the form
const filterFormValidationSchema = Yup.object({
  user: Yup.string(),
  week: Yup.string()
});

// Initial form values
const initialValues = () => {
  return {
    user: "",
    week: ""
  };
};

// Render
