import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { History } from "history";

// Added from CommentList component
interface PassedProps {
  snippetId: string;
  addComment: (values: any) => void;
  fetchComments: (snippetId: string) => void;
  selectedComment: string | null;
  updateCommentState: (content: string, time: Date) => void;
}

interface InsideProps {
  history: History;
}

type AllProps = PassedProps;

const AddCommentForm = (props: AllProps, prop: InsideProps) => {
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
      let time = new Date();

      props.addComment({
        comment: values.comment,
        snippetId: props.snippetId,
        timeCreated: time
      });

      setTimeout(props.updateCommentState, 500, values.comment, time);
      actions.setSubmitting(false);
      actions.resetForm({});
    }
  });

  // Explicit Formik with Materialize CSS
  return (
    <div className="row">
      <form onSubmit={formik.handleSubmit}>
        <button
          type="submit"
          className="right btn waves-effect waves-light blue"
        >
          Add
          <i className="material-icons right">comment</i>
        </button>
        <div className="right input-field col s7">
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
      </form>
    </div>
  );
};

export default AddCommentForm;
