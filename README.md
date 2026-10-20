# Fitora — Smart Fitness & Meal Optimization Tool

Fitora is a React + Vite fitness dashboard. The existing violet/black visual design and original Overview, Meal Optimizer, and Workout Planner remain in place. Additional tools have been integrated into the existing experience.

## Features

- Personal fitness calculator: BMI screening estimate, approximate BMR/maintenance calories, goal-based starting calorie estimate, food preferences, and movement adaptations.
- Vegetarian, vegan, and omnivore filtering with favorite-food matching.
- Sample Indian foods in the nutrition database, including idli, dosa, roti, chana masala, sambar, poha, moong sprouts, and soya chunks. Values are estimates; verify serving sizes and product labels.
- Seven-day starter meal and movement schedule, adjusted for dietary preferences and conservative injury/mobility guidance.
- Filterable exercise idea library with strength, cardio, mobility, and accessible options.
- Meal substitution ideas to support dietary preferences.
- Daily check-in for weight, calories, protein, carbohydrates, fat, fiber, water, sleep, and completed workouts.
- Weight history chart and recent daily records.
- Local browser persistence for profile preferences, daily habits, and progress history. Data stays in this browser/device; it does not sync across devices or create an online account.
- Print-friendly report. Use **Export report / Save as PDF**, then choose **Save as PDF** in the browser print dialog.
- Built-in rule-based fitness guide for common general questions; it is not a live AI service.
- Existing meal optimizer, workout planner, and custom-food support.

## Run locally

1. Install Node.js (LTS recommended).
2. Open this project folder in a terminal.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite, usually `http://localhost:5173`.

## Health and accuracy note

BMI and calorie calculations are rough estimates, not diagnoses or medical prescriptions. Food nutrition data is illustrative and can vary with recipe and serving size. Exercise ideas cannot determine whether a movement is safe for a specific disability or injury. Users with injuries, medical conditions, or specific rehabilitation needs should consult a qualified clinician or physiotherapist. Stop movements that cause pain or worsening symptoms.
