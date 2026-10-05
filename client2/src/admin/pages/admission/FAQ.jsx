import React, { useEffect, useState } from "react";

import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";

import {
  getAdminFAQ,
  updateFAQ,
  publishFAQ,
  unpublishFAQ,
  resetFAQ,
} from "../../services/faqService.js";

import "./FAQ.css";

const FAQ = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [faqData, setFaqData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [publishing, setPublishing] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [showResetModal, setShowResetModal] = useState(false);

  /* =========================================================
     LOAD FAQ
  ========================================================= */

  const loadFAQ = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getAdminFAQ();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load FAQ.");
      }

      setFaqData(response.data || null);
    } catch (err) {
      console.error("Admin FAQ Load Error:", err);

      setError(
        err?.response?.data?.message || err?.message || "Unable to load FAQ.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadFAQ();
  }, []);

  /* =========================================================
     CLEAR MESSAGE
  ========================================================= */

  const clearMessages = () => {
    setMessage("");

    setError("");
  };

  /* =========================================================
     UPDATE MAIN FIELD
  ========================================================= */

  const handleFieldChange = (field, value) => {
    setFaqData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =========================================================
     UPDATE CATEGORY
  ========================================================= */

  const handleCategoryChange = (index, value) => {
    setFaqData((previous) => {
      const categories = [...(previous.categories || [])];

      categories[index] = value;

      return {
        ...previous,
        categories,
      };
    });
  };

  /* =========================================================
     ADD CATEGORY
  ========================================================= */

  const handleAddCategory = () => {
    setFaqData((previous) => ({
      ...previous,

      categories: [...(previous.categories || []), "New Category"],
    }));
  };

  /* =========================================================
     DELETE CATEGORY
  ========================================================= */

  const handleDeleteCategory = (index) => {
    setFaqData((previous) => {
      const categories = [...(previous.categories || [])];

      categories.splice(index, 1);

      return {
        ...previous,
        categories,
      };
    });
  };

  /* =========================================================
     UPDATE FAQ ITEM
  ========================================================= */

  const handleFAQChange = (index, field, value) => {
    setFaqData((previous) => {
      const faqs = [...(previous.faqs || [])];

      faqs[index] = {
        ...faqs[index],
        [field]: value,
      };

      return {
        ...previous,
        faqs,
      };
    });
  };

  /* =========================================================
     ADD FAQ
  ========================================================= */

  const handleAddFAQ = () => {
    setFaqData((previous) => {
      const faqs = [...(previous.faqs || [])];

      faqs.push({
        question: "Enter your question here.",

        answer: "Enter the answer here.",

        category: previous.categories?.[0] || "General",

        displayOrder: faqs.length + 1,

        isActive: true,
      });

      return {
        ...previous,
        faqs,
      };
    });
  };

  /* =========================================================
     DELETE FAQ
  ========================================================= */

  const handleDeleteFAQ = (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FAQ?",
    );

    if (!confirmed) {
      return;
    }

    setFaqData((previous) => {
      const faqs = [...(previous.faqs || [])];

      faqs.splice(index, 1);

      /*
       * Recalculate display order
       */

      faqs.forEach((item, itemIndex) => {
        item.displayOrder = itemIndex + 1;
      });

      return {
        ...previous,
        faqs,
      };
    });
  };

  /* =========================================================
     MOVE FAQ UP
  ========================================================= */

  const handleMoveUp = (index) => {
    if (index <= 0) {
      return;
    }

    setFaqData((previous) => {
      const faqs = [...(previous.faqs || [])];

      [faqs[index - 1], faqs[index]] = [faqs[index], faqs[index - 1]];

      faqs.forEach((item, itemIndex) => {
        item.displayOrder = itemIndex + 1;
      });

      return {
        ...previous,
        faqs,
      };
    });
  };

  /* =========================================================
     MOVE FAQ DOWN
  ========================================================= */

  const handleMoveDown = (index) => {
    setFaqData((previous) => {
      const faqs = [...(previous.faqs || [])];

      if (index >= faqs.length - 1) {
        return previous;
      }

      [faqs[index], faqs[index + 1]] = [faqs[index + 1], faqs[index]];

      faqs.forEach((item, itemIndex) => {
        item.displayOrder = itemIndex + 1;
      });

      return {
        ...previous,
        faqs,
      };
    });
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      clearMessages();

      const response = await updateFAQ(faqData);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to save FAQ.");
      }

      setFaqData(response.data);

      setMessage("FAQ changes saved successfully.");
    } catch (err) {
      console.error("FAQ Save Error:", err);

      setError(
        err?.response?.data?.message || err?.message || "Unable to save FAQ.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     PUBLISH
  ========================================================= */

  const handlePublish = async () => {
    try {
      setPublishing(true);

      clearMessages();

      /*
       * First save the current edits.
       */

      const saveResponse = await updateFAQ(faqData);

      if (!saveResponse?.success) {
        throw new Error(
          saveResponse?.message || "Unable to save FAQ before publishing.",
        );
      }

      /*
       * Then publish.
       */

      const response = await publishFAQ();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to publish FAQ.");
      }

      setFaqData(response.data);

      setMessage("FAQ published successfully.");
    } catch (err) {
      console.error("FAQ Publish Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to publish FAQ.",
      );
    } finally {
      setPublishing(false);
    }
  };

  /* =========================================================
     UNPUBLISH
  ========================================================= */

  const handleUnpublish = async () => {
    try {
      setPublishing(true);

      clearMessages();

      const response = await unpublishFAQ();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to unpublish FAQ.");
      }

      setFaqData(response.data);

      setMessage("FAQ unpublished successfully.");
    } catch (err) {
      console.error("FAQ Unpublish Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to unpublish FAQ.",
      );
    } finally {
      setPublishing(false);
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = async () => {
    try {
      setPublishing(true);

      clearMessages();

      const response = await resetFAQ();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to reset FAQ.");
      }

      setFaqData(response.data);

      setShowResetModal(false);

      setMessage("FAQ restored to default data.");
    } catch (err) {
      console.error("FAQ Reset Error:", err);

      setError(
        err?.response?.data?.message || err?.message || "Unable to reset FAQ.",
      );
    } finally {
      setPublishing(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="faqAdminPage">
        <div className="faqAdminLoading">
          <Spinner animation="border" />

          <p>Loading FAQ...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR / NO DATA
  ========================================================= */

  if (!faqData) {
    return (
      <div className="faqAdminPage">
        <Alert variant="danger">{error || "FAQ data is not available."}</Alert>

        <Button type="button" onClick={loadFAQ}>
          Try Again
        </Button>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="faqAdminPage">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="faqAdminHeader">
        <div className="faqAdminHeaderContent">
          <div className="faqAdminEyebrow">ADMISSIONS</div>

          <h1>Frequently Asked Questions</h1>

          <p>
            Manage the questions and answers displayed on the public website.
          </p>
        </div>

        <div className="faqAdminHeaderActions">
          <div
            className={
              faqData.isPublished
                ? "faqStatus published"
                : "faqStatus unpublished"
            }
          >
            <span className="faqStatusDot" />

            {faqData.isPublished ? "Published" : "Unpublished"}
          </div>

          <Button
            type="button"
            className="faqResetButton"
            onClick={() => setShowResetModal(true)}
            disabled={saving || publishing}
          >
            Reset Default
          </Button>

          {faqData.isPublished ? (
            <Button
              type="button"
              className="faqUnpublishButton"
              onClick={handleUnpublish}
              disabled={saving || publishing}
            >
              {publishing ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Unpublish"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              className="faqPublishButton"
              onClick={handlePublish}
              disabled={saving || publishing}
            >
              {publishing ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Publish"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <section className="faqAdminCard">
        <div className="faqSectionHeader">
          <div>
            <span>PAGE CONTENT</span>

            <h2>FAQ Header</h2>
          </div>
        </div>

        <div className="faqAdminGrid">
          {/* HERO LABEL */}

          <Form.Group>
            <Form.Label>Hero Label</Form.Label>

            <Form.Control
              type="text"
              value={faqData.heroLabel || ""}
              onChange={(event) =>
                handleFieldChange("heroLabel", event.target.value)
              }
            />
          </Form.Group>

          {/* PAGE TITLE */}

          <Form.Group>
            <Form.Label>Page Title</Form.Label>

            <Form.Control
              type="text"
              value={faqData.title || ""}
              onChange={(event) =>
                handleFieldChange("title", event.target.value)
              }
            />
          </Form.Group>

          {/* HERO TITLE */}

          <Form.Group className="faqFullField">
            <Form.Label>Hero Title</Form.Label>

            <Form.Control
              type="text"
              value={faqData.heroTitle || ""}
              onChange={(event) =>
                handleFieldChange("heroTitle", event.target.value)
              }
            />
          </Form.Group>

          {/* SUBTITLE */}

          <Form.Group className="faqFullField">
            <Form.Label>Subtitle</Form.Label>

            <Form.Control
              type="text"
              value={faqData.subtitle || ""}
              onChange={(event) =>
                handleFieldChange("subtitle", event.target.value)
              }
            />
          </Form.Group>

          {/* DESCRIPTION */}

          <Form.Group className="faqFullField">
            <Form.Label>Hero Description</Form.Label>

            <Form.Control
              as="textarea"
              rows={4}
              value={faqData.heroDescription || ""}
              onChange={(event) =>
                handleFieldChange("heroDescription", event.target.value)
              }
            />
          </Form.Group>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="faqAdminCard">
        <div className="faqSectionHeader">
          <div>
            <span>ORGANIZATION</span>

            <h2>FAQ Categories</h2>
          </div>

          <Button
            type="button"
            className="faqAddButton"
            onClick={handleAddCategory}
          >
            + Add Category
          </Button>
        </div>

        <div className="faqCategories">
          {(faqData.categories || []).map((category, index) => (
            <div className="faqCategoryItem" key={index}>
              <div className="faqCategoryNumber">{index + 1}</div>

              <Form.Control
                type="text"
                value={category}
                onChange={(event) =>
                  handleCategoryChange(index, event.target.value)
                }
              />

              <Button
                type="button"
                className="faqCategoryDelete"
                onClick={() => handleDeleteCategory(index)}
                title="Delete category"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          FAQ QUESTIONS
      ===================================================== */}

      <section className="faqAdminCard">
        <div className="faqSectionHeader">
          <div>
            <span>QUESTIONS & ANSWERS</span>

            <h2>Manage Questions</h2>
          </div>

          <Button type="button" className="faqAddButton" onClick={handleAddFAQ}>
            + Add Question
          </Button>
        </div>

        <div className="faqAdminList">
          {(faqData.faqs || []).map((item, index) => (
            <article
              className={
                item.isActive === false
                  ? "faqEditorCard inactive"
                  : "faqEditorCard"
              }
              key={item._id || index}
            >
              {/* =========================================
                    FAQ HEADER
                ========================================= */}

              <div className="faqEditorHeader">
                <div className="faqEditorNumber">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="faqEditorHeading">
                  <strong>FAQ #{index + 1}</strong>

                  <span
                    className={
                      item.isActive === false
                        ? "faqItemStatus inactive"
                        : "faqItemStatus"
                    }
                  >
                    {item.isActive === false ? "Inactive" : "Active"}
                  </span>
                </div>

                <div className="faqEditorActions">
                  <Button
                    type="button"
                    className="faqMoveButton"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    ↑
                  </Button>

                  <Button
                    type="button"
                    className="faqMoveButton"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === faqData.faqs.length - 1}
                    title="Move down"
                  >
                    ↓
                  </Button>

                  <Button
                    type="button"
                    className="faqDeleteButton"
                    onClick={() => handleDeleteFAQ(index)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* =========================================
                    FAQ FORM
                ========================================= */}

              <div className="faqEditorGrid">
                {/* CATEGORY */}

                <Form.Group>
                  <Form.Label>Category</Form.Label>

                  <Form.Select
                    value={item.category || "General"}
                    onChange={(event) =>
                      handleFAQChange(index, "category", event.target.value)
                    }
                  >
                    {(faqData.categories || ["General"]).map(
                      (category, categoryIndex) => (
                        <option key={categoryIndex} value={category}>
                          {category}
                        </option>
                      ),
                    )}
                  </Form.Select>
                </Form.Group>

                {/* ORDER */}

                <Form.Group>
                  <Form.Label>Display Order</Form.Label>

                  <Form.Control
                    type="number"
                    min="1"
                    value={item.displayOrder || index + 1}
                    onChange={(event) =>
                      handleFAQChange(
                        index,
                        "displayOrder",
                        Number(event.target.value),
                      )
                    }
                  />
                </Form.Group>

                {/* QUESTION */}

                <Form.Group className="faqFullField">
                  <Form.Label>Question</Form.Label>

                  <Form.Control
                    type="text"
                    value={item.question || ""}
                    onChange={(event) =>
                      handleFAQChange(index, "question", event.target.value)
                    }
                  />
                </Form.Group>

                {/* ANSWER */}

                <Form.Group className="faqFullField">
                  <Form.Label>Answer</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={item.answer || ""}
                    onChange={(event) =>
                      handleFAQChange(index, "answer", event.target.value)
                    }
                  />
                </Form.Group>

                {/* ACTIVE */}

                <div className="faqActiveControl">
                  <Form.Check
                    type="switch"
                    id={`faq-active-${index}`}
                    checked={item.isActive !== false}
                    onChange={(event) =>
                      handleFAQChange(index, "isActive", event.target.checked)
                    }
                    label={
                      item.isActive === false
                        ? "Inactive — hidden from public page"
                        : "Active — visible on public page"
                    }
                  />
                </div>
              </div>
            </article>
          ))}

          {/* NO FAQ */}

          {(faqData.faqs || []).length === 0 && (
            <div className="faqNoItems">
              <div>?</div>

              <h3>No FAQ questions</h3>

              <p>Add your first frequently asked question.</p>

              <Button
                type="button"
                className="faqAddButton"
                onClick={handleAddFAQ}
              >
                + Add Question
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          SAVE BAR
      ===================================================== */}

      <div className="faqAdminSaveBar">
        <div>
          <strong>
            {faqData.isPublished
              ? "Public FAQ is currently published"
              : "Public FAQ is currently unpublished"}
          </strong>

          <span>Save your changes before leaving this page.</span>
        </div>

        <Button
          type="button"
          className="faqSaveButton"
          onClick={handleSave}
          disabled={saving || publishing}
        >
          {saving ? (
            <>
              <Spinner size="sm" animation="border" />

              <span>Saving...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      {/* =====================================================
          RESET MODAL
      ===================================================== */}

      <Modal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset FAQ</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="faqResetWarning">
            <div className="faqResetWarningIcon">!</div>

            <div>
              <h4>Restore Default FAQ?</h4>

              <p>
                This will replace the current questions, answers, categories and
                page content with the default FAQ data.
              </p>

              <p>Your current custom changes will be lost.</p>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="light"
            onClick={() => setShowResetModal(false)}
            disabled={publishing}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleReset}
            disabled={publishing}
          >
            {publishing ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Reset FAQ"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FAQ;
