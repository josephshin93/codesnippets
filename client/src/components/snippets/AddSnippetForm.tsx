import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface FormProps {
  // TODO: Typescript format
  teams: any;
  user: any;
  addSnippet(values: any): any;
}

const AddSnippetForm = (props: FormProps) => {
  // Pass the useFormik() hook for initial form values, validate, & submit
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      content: "",
      status: "Open",
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
          ownerID: props.user.googleId,
          ownerName: props.user.firstName + " " + props.user.lastName
        });
        // FIX logic
        actions.setSubmitting(false);
        actions.resetForm({});
        actions.setStatus({ success: "Snippet Created !" });
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
              <option value="Open">Open</option>
              <option value="Block">Block</option>
              <option value="Done">Done</option>
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
        <div>
          <h3>{formik.status ? formik.status.success : ""}</h3>
        </div>
      </form>
    </div>
  );
};

export default AddSnippetForm;
