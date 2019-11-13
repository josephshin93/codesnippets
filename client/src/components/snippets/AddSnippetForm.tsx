import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface FormProps {
  // TODO: Typescript format
  teams: any;
  auth: any;
  history: any;
  addSnippet(values: any): any;
}

const AddSnippetForm = (props: FormProps) => {
  // Pass the useFormik() hook for initial form values, validate, & submit
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      content: "",
      status: "open",
      team: ""
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      description: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      content: Yup.string()
        .max(4000, "Must be 4000 characters or less")
        .required("Required"),
      status: Yup.string(),
      team: Yup.string().required("Must choose team")
    }),
    onSubmit: (values, actions) => {
      setTimeout(() => {
        props.addSnippet({
          title: values.title,
          description: values.description,
          content: values.content,
          status: values.status,
          team: values.team,
          ownerID: props.auth.googleId,
          ownerName: props.auth.firstName + " " + props.auth.lastname
        });
        actions.setSubmitting(false);
        actions.resetForm();
        props.history.push("/dashboard");
      }, 1000);
    }
  });
  // Combined Materialize CSS layout with explicit Formik form
  // Will most likely refactor with <Formik> component later
  return (
    <div className="row">
      <form className="col s12" onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="input-field col s12">
            <input id="title" type="text" {...formik.getFieldProps("title")} />
            <label htmlFor="title">Title</label>
            {formik.touched.title && formik.errors.title ? (
              <div>
                <span className="red-text text-darken-2">
                  {formik.errors.title}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input
              id="description"
              type="text"
              {...formik.getFieldProps("description")}
            />
            <label htmlFor="title">Description</label>
            {formik.touched.description && formik.errors.description ? (
              <div>
                <span className="red-text text-darken-2">
                  {formik.errors.description}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <textarea
              id="content"
              className="materialize-textarea"
              {...formik.getFieldProps("content")}
            ></textarea>
            <label htmlFor="title">Content</label>
            {formik.touched.content && formik.errors.content ? (
              <div>
                <span className="red-text text-darken-2">
                  {formik.errors.content}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="input-field col s3">
            <span className="#9e9e9e grey-text">Status</span>
            <select
              id="status"
              className="browser-default"
              {...formik.getFieldProps("status")}
            >
              <option value="open">Open</option>
              <option value="block">Block</option>
              <option value="done">Done</option>
            </select>
            {formik.touched.status && formik.errors.status ? (
              <div>{formik.errors.status}</div>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="input-field col s3">
            <span className="#9e9e9e grey-text">Team</span>
            <select
              id="team"
              className="browser-default"
              value=""
              {...formik.getFieldProps("team")}
            >
              <option value="">Select team</option>
              {props.teams}
            </select>
            {formik.touched.team && formik.errors.team ? (
              <div>
                <span className="red-text text-darken-2">
                  {formik.errors.team}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <br />
        <button
          type="reset"
          className="btn waves-effect waves-light red"
          onClick={() => formik.resetForm()}
          style={{ marginRight: "10px" }}
        >
          Clear
          <i className="material-icons right">cancel</i>
        </button>
        <button type="submit" className="btn waves-effect waves-light blue">
          Submit
          <i className="material-icons right">send</i>
        </button>
      </form>
    </div>
  );
};

export default AddSnippetForm;
