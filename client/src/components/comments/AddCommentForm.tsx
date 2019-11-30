import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// Added from CommentList component
interface PassedProps {
  snippetId: string;
  addComment: (values: any) => void;
}

const AddCommentForm = (props: PassedProps) => {
  // Pass the useFormik() to initialize the form
  const formik = useFormik({
    initialValues: {
      comment: ""
    },
    validationSchema: Yup.object({
      comment: Yup.string()
        .max(140, "Must be 140 characters or less")
        .required("Required")
    }),
    onSubmit: (values, actions) => {
      console.log("Firing away! Snippet id = " + props.snippetId);
      setTimeout(() => {
        props.addComment({
          comment: values.comment,
          snippetId: props.snippetId
        });
        actions.setSubmitting(false);
        actions.resetForm({});
      }, 500);
    }
  });

  // Explicit Formik with Materialize CSS
  return (
    <div className="row">
      <form onSubmit={formik.handleSubmit}>
        <div className="input-field col s5">
          <textarea
            id="comment"
            className="materialize-textarea"
            {...formik.getFieldProps("comment")}
          />
          <label htmlFor="comment">Comment</label>
          {formik.touched.comment && formik.errors.comment ? (
            <div>
              <span className="red-text text-darken-2">
                {formik.errors.comment}
              </span>
            </div>
          ) : null}
        </div>
        <br />
        <button type="submit" className="btn waves-effect waves-light blue">
          Add
          <i className="material-icons right">comment</i>
        </button>
      </form>
    </div>
  );
};

export default AddCommentForm;
