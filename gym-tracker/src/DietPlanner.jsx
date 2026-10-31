
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Salad,
  Plus,
  Trash2,
  Utensils,
  CalendarDays,
  Flame,
  ClipboardList
} from "lucide-react";

import Sidebar from "./Sidebar";
import "./DietPlanner.css";

const emptyMeal = {
  mealType: "Breakfast",
  foodName: "",
  quantity: "",
  calories: "",
};

function DietPlanner() {
  const navigate = useNavigate();

  const [planName, setPlanName] = useState("My Diet Plan");

  const [planDate, setPlanDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  const [meals, setMeals] = useState([{ ...emptyMeal }]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/diet-plans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        setSavedPlans(
          Array.isArray(data) ? data : data.dietPlans || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Could not load saved diet plans."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [navigate, token]);

  const handleMealChange = (index, field, value) => {
    setMeals((previous) =>
      previous.map((meal, mealIndex) =>
        mealIndex === index
          ? { ...meal, [field]: value }
          : meal
      )
    );
  };

  const addMeal = () => {
    setMeals((previous) => [
      ...previous,
      { ...emptyMeal },
    ]);
  };

  const removeMeal = (index) => {
    setMeals((previous) =>
      previous.filter((_, mealIndex) => mealIndex !== index)
    );
  };

  const totalCalories = meals.reduce(
    (total, meal) => total + (Number(meal.calories) || 0),
    0
  );

  const handleSavePlan = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!planName.trim() || !planDate) {
      setError("Please enter a plan name and date.");
      return;
    }

    const invalidMeal = meals.some(
      (meal) =>
        !meal.foodName.trim() ||
        !meal.quantity.trim() ||
        meal.calories === "" ||
        Number(meal.calories) < 0
    );

    if (meals.length === 0 || invalidMeal) {
      setError(
        "Add at least one meal and complete its food, quantity, and calorie fields."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await axios.post(
        "http://localhost:5000/api/diet-plans",
        {
          planName: planName.trim(),
          date: planDate,
          meals: meals.map((meal) => ({
            mealType: meal.mealType,
            foodName: meal.foodName.trim(),
            quantity: meal.quantity.trim(),
            calories: Number(meal.calories),
          })),
          totalCalories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const savedPlan =
        response.data.dietPlan || response.data;

      setSavedPlans((previous) => [
        savedPlan,
        ...previous,
      ]);

      setSuccess("Your diet plan was saved successfully.");

      setPlanName("My Diet Plan");
      setPlanDate(new Date().toLocaleDateString("en-CA"));
      setMeals([{ ...emptyMeal }]);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not save your diet plan."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="diet-page">

      {/* REUSABLE SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="diet-content">

        {/* HEADER */}
        <header className="diet-header">
          <div>
            <h1>Diet Planner</h1>
            <p>
              Plan your meals and track your daily calories.
            </p>
          </div>

          <Salad size={30} />
        </header>

        {/* SUMMARY */}
        <section className="diet-summary">

          <div className="diet-summary-card">
            <div className="diet-summary-icon">
              <Utensils size={23} />
            </div>

            <span>Meals in Current Plan</span>
            <h2>{meals.length}</h2>
          </div>

          <div className="diet-summary-card">
            <div className="diet-summary-icon">
              <Flame size={23} />
            </div>

            <span>Planned Calories</span>
            <h2>{totalCalories.toLocaleString()} kcal</h2>
          </div>

          <div className="diet-summary-card">
            <div className="diet-summary-icon">
              <ClipboardList size={23} />
            </div>

            <span>Saved Plans</span>
            <h2>{savedPlans.length}</h2>
          </div>

        </section>

        {/* CREATE DIET PLAN */}
        <section className="diet-form-card">

          <h2>Create Your Diet Plan</h2>

          <p className="diet-section-description">
            Choose your meals and enter your own food details.
          </p>

          {error && (
            <div className="diet-error">{error}</div>
          )}

          {success && (
            <div className="diet-success">{success}</div>
          )}

          <form onSubmit={handleSavePlan}>

            {/* PLAN DETAILS */}
            <div className="diet-plan-details">

              <div className="diet-field">
                <label htmlFor="planName">Plan Name</label>

                <input
                  id="planName"
                  type="text"
                  value={planName}
                  onChange={(event) =>
                    setPlanName(event.target.value)
                  }
                  placeholder="Example: Muscle Gain Diet"
                  required
                />
              </div>

              <div className="diet-field">
                <label htmlFor="planDate">Plan Date</label>

                <input
                  id="planDate"
                  type="date"
                  value={planDate}
                  onChange={(event) =>
                    setPlanDate(event.target.value)
                  }
                  required
                />
              </div>

            </div>

            {/* MEALS HEADING */}
            <div className="diet-meals-heading">

              <div>
                <h3>Your Meals</h3>
                <p>Add each food item as a separate entry.</p>
              </div>

              <button
                type="button"
                className="diet-secondary-button"
                onClick={addMeal}
              >
                <Plus size={18} />
                Add Meal
              </button>

            </div>

            {/* MEAL INPUTS */}
            {meals.map((meal, index) => (

              <div className="diet-meal-card" key={index}>

                <div className="diet-meal-top">

                  <h4>
                    <Utensils size={18} />
                    Meal {index + 1}
                  </h4>

                  <button
                    type="button"
                    className="diet-remove-button"
                    onClick={() => removeMeal(index)}
                    disabled={meals.length === 1}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>

                </div>

                <div className="diet-meal-fields">

                  <div className="diet-field">
                    <label htmlFor={`mealType-${index}`}>
                      Meal Type
                    </label>

                    <select
                      id={`mealType-${index}`}
                      value={meal.mealType}
                      onChange={(event) =>
                        handleMealChange(
                          index,
                          "mealType",
                          event.target.value
                        )
                      }
                    >
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Snack</option>
                      <option>Pre-Workout</option>
                      <option>Post-Workout</option>
                    </select>
                  </div>

                  <div className="diet-field">
                    <label htmlFor={`foodName-${index}`}>
                      Food Item
                    </label>

                    <input
                      id={`foodName-${index}`}
                      type="text"
                      value={meal.foodName}
                      onChange={(event) =>
                        handleMealChange(
                          index,
                          "foodName",
                          event.target.value
                        )
                      }
                      placeholder="Example: Rice and eggs"
                      required
                    />
                  </div>

                  <div className="diet-field">
                    <label htmlFor={`quantity-${index}`}>
                      Quantity
                    </label>

                    <input
                      id={`quantity-${index}`}
                      type="text"
                      value={meal.quantity}
                      onChange={(event) =>
                        handleMealChange(
                          index,
                          "quantity",
                          event.target.value
                        )
                      }
                      placeholder="Example: 200 g"
                      required
                    />
                  </div>

                  <div className="diet-field">
                    <label htmlFor={`calories-${index}`}>
                      Calories (kcal)
                    </label>

                    <input
                      id={`calories-${index}`}
                      type="number"
                      min="0"
                      step="1"
                      value={meal.calories}
                      onChange={(event) =>
                        handleMealChange(
                          index,
                          "calories",
                          event.target.value
                        )
                      }
                      placeholder="Example: 350"
                      required
                    />
                  </div>

                </div>
              </div>

            ))}

            {/* TOTAL CALORIES */}
            <div className="diet-calorie-total">

              <span>Total planned calories</span>

              <strong>
                <Flame size={19} />
                {totalCalories.toLocaleString()} kcal
              </strong>

            </div>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              className="diet-save-button"
              disabled={saving}
            >
              {saving ? "Saving Plan..." : "Save Diet Plan"}
            </button>

          </form>

        </section>

        {/* SAVED PLANS */}
        <section className="diet-saved-section">

          <h2>Saved Diet Plans</h2>

          <p className="diet-section-description">
            Your previously saved plans appear here.
          </p>

          {loading ? (

            <div className="diet-empty">
              Loading your saved plans...
            </div>

          ) : savedPlans.length === 0 ? (

            <div className="diet-empty">

              <Salad size={38} />

              <h3>No saved plans yet</h3>

              <p>
                Create your first plan using the form above.
              </p>

            </div>

          ) : (

            <div className="diet-saved-list">

              {savedPlans.map((plan, index) => (

                <article
                  className="diet-saved-card"
                  key={plan._id || index}
                >

                  <div>
                    <h3>{plan.planName || "My Diet Plan"}</h3>

                    <p>
                      {plan.date
                        ? new Date(plan.date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              timeZone: "UTC",
                            }
                          )
                        : "Date not available"}
                    </p>

                    <span>
                      {plan.meals?.length || 0} meal entries
                    </span>
                  </div>

                  <strong>
                    {Number(
                      plan.totalCalories ??
                        plan.meals?.reduce(
                          (total, meal) =>
                            total + (Number(meal.calories) || 0),
                          0
                        ) ??
                        0
                    ).toLocaleString()}{" "}
                    kcal
                  </strong>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default DietPlanner;
