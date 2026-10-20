export const FOOD_DB = [
  {
    id: 'egg',
    name: 'Boiled eggs',
    category: 'Protein',
    serving: '1 egg',
    calories: 78,
    protein: 6.3,
    fat: 5.3,
    fiber: 0,
    carbs: 0.6,
    divisible: false,
    max: 4
  },
  {
    id: 'chicken',
    name: 'Chicken breast',
    category: 'Protein',
    serving: '100 g',
    calories: 165,
    protein: 31,
    fat: 3.6,
    fiber: 0,
    carbs: 0,
    divisible: true,
    max: 3
  },
  {
    id: 'paneer',
    name: 'Paneer',
    category: 'Protein',
    serving: '100 g',
    calories: 265,
    protein: 18.3,
    fat: 20.8,
    fiber: 0,
    carbs: 1.2,
    divisible: true,
    max: 2
  },
  {
    id: 'dal',
    name: 'Cooked dal',
    category: 'Protein',
    serving: '150 g bowl',
    calories: 174,
    protein: 11,
    fat: 3.5,
    fiber: 8,
    carbs: 25,
    divisible: true,
    max: 3
  },
  {
    id: 'greek-yogurt',
    name: 'Greek yogurt',
    category: 'Dairy',
    serving: '170 g cup',
    calories: 100,
    protein: 17,
    fat: 0,
    fiber: 0,
    carbs: 6,
    divisible: false,
    max: 2
  },
  {
    id: 'rice',
    name: 'Cooked rice',
    category: 'Carbs',
    serving: '100 g',
    calories: 130,
    protein: 2.7,
    fat: 0.3,
    fiber: 0.4,
    carbs: 28,
    divisible: true,
    max: 3
  },
  {
    id: 'oats',
    name: 'Oats',
    category: 'Carbs',
    serving: '40 g',
    calories: 152,
    protein: 5.3,
    fat: 2.7,
    fiber: 4,
    carbs: 27,
    divisible: true,
    max: 2
  },
  {
    id: 'banana',
    name: 'Banana',
    category: 'Fruit',
    serving: '1 banana',
    calories: 89,
    protein: 1.1,
    fat: 0.3,
    fiber: 2.6,
    carbs: 23,
    divisible: false,
    max: 2
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    category: 'Vegetables',
    serving: '100 g',
    calories: 35,
    protein: 2.4,
    fat: 0.4,
    fiber: 3.3,
    carbs: 7,
    divisible: true,
    max: 3
  },
  {
    id: 'almonds',
    name: 'Almonds',
    category: 'Healthy fats',
    serving: '15 g handful',
    calories: 87,
    protein: 3.2,
    fat: 7.5,
    fiber: 1.8,
    carbs: 3.2,
    divisible: true,
    max: 2
  },
  {
    id: 'milk',
    name: 'Low-fat milk',
    category: 'Dairy',
    serving: '250 ml glass',
    calories: 122,
    protein: 8.2,
    fat: 4.8,
    fiber: 0,
    carbs: 12,
    divisible: true,
    max: 2
  },
  {
    id: 'tofu',
    name: 'Firm tofu',
    category: 'Protein',
    serving: '100 g',
    calories: 144,
    protein: 17,
    fat: 8.7,
    fiber: 2.3,
    carbs: 2.8,
    divisible: true,
    max: 2
  }
];


// =====================================================
// MEAL OPTIMIZATION
// =====================================================

export function optimizeMeals({
  calories = 2000,
  fatFloor = 40,
  fiberFloor = 20,
  proteinGoal = 120,
  foods = FOOD_DB
} = {}) {

  const choices = foods.map(food =>
    Array.from(
      {
        length: food.divisible
          ? food.max + 1
          : 2
      },
      (_, qty) => ({
        food,
        qty
      })
    )
  );

  let best = null;
  let bestScore = -Infinity;
  let explored = 0;

  const suffixProtein =
    Array(foods.length + 1).fill(0);

  for (
    let i = foods.length - 1;
    i >= 0;
    i--
  ) {
    suffixProtein[i] =
      suffixProtein[i + 1] +
      foods[i].protein *
        (
          foods[i].divisible
            ? foods[i].max
            : 1
        );
  }


  function search(
    i,
    selected,
    totals
  ) {

    explored++;


    if (
      totals.calories > calories ||
      totals.protein +
        suffixProtein[i] <
        (best?.totals?.protein ?? 0)
    ) {
      return;
    }


    if (i === foods.length) {

      if (
        totals.fat + 1e-9 < fatFloor ||
        totals.fiber + 1e-9 < fiberFloor
      ) {
        return;
      }


      const score =
        totals.protein -
        Math.max(
          0,
          totals.calories - calories
        ) * 10;


      if (score > bestScore) {

        bestScore = score;

        best = {
          selected:
            selected.filter(
              x => x.qty > 0
            ),

          totals: {
            ...totals
          }
        };
      }

      return;
    }


    for (
      const option of choices[i]
    ) {

      if (!option.qty) {

        search(
          i + 1,
          selected,
          totals
        );

        continue;
      }


      const food = option.food;
      const qty = option.qty;


      search(
        i + 1,
        [
          ...selected,
          option
        ],
        {
          calories:
            totals.calories +
            food.calories * qty,

          protein:
            totals.protein +
            food.protein * qty,

          fat:
            totals.fat +
            food.fat * qty,

          fiber:
            totals.fiber +
            food.fiber * qty,

          carbs:
            totals.carbs +
            food.carbs * qty
        }
      );
    }
  }


  search(
    0,
    [],
    {
      calories: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
      carbs: 0
    }
  );


  // ===================================================
  // BEST-EFFORT FALLBACK
  // ===================================================

  if (!best) {

    const ranked = foods
      .map(food => ({
        food,
        qty:
          food.divisible
            ? food.max
            : 1
      }))
      .sort(
        (a, b) =>
          b.food.protein /
            b.food.calories -
          a.food.protein /
            a.food.calories
      );


    const selected = [];

    let totals = {
      calories: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
      carbs: 0
    };


    for (
      const item of ranked
    ) {

      const qty = Math.min(
        item.qty,
        Math.floor(
          (calories -
            totals.calories) /
            item.food.calories
        )
      );


      if (qty > 0) {

        selected.push({
          ...item,
          qty
        });


        totals.calories +=
          item.food.calories *
          qty;

        totals.protein +=
          item.food.protein *
          qty;

        totals.fat +=
          item.food.fat *
          qty;

        totals.fiber +=
          item.food.fiber *
          qty;

        totals.carbs +=
          item.food.carbs *
          qty;
      }
    }


    best = {
      selected,
      totals,
      fallback: true
    };
  }


  return {
    ...best,

    explored,

    feasible:
      !best.fallback &&
      best.totals.fat >= fatFloor &&
      best.totals.fiber >= fiberFloor,

    proteinGoal
  };
}


// =====================================================
// WORKOUT DATA
// =====================================================

const MUSCLES = [
  {
    name: 'Chest',
    conflicts: [
      'Shoulders',
      'Triceps'
    ]
  },

  {
    name: 'Back',
    conflicts: [
      'Biceps',
      'Shoulders'
    ]
  },

  {
    name: 'Shoulders',
    conflicts: [
      'Chest',
      'Back',
      'Triceps'
    ]
  },

  {
    name: 'Biceps',
    conflicts: [
      'Back'
    ]
  },

  {
    name: 'Triceps',
    conflicts: [
      'Chest',
      'Shoulders'
    ]
  },

  {
    name: 'Legs',
    conflicts: [
      'Core'
    ]
  },

  {
    name: 'Core',
    conflicts: [
      'Legs',
      'Back'
    ]
  }
];


export const WORKOUTS = {

  Chest: [
    'Bench press',
    'Incline dumbbell press',
    'Push-ups'
  ],

  Back: [
    'Lat pulldown',
    'Seated row',
    'Face pulls'
  ],

  Shoulders: [
    'Overhead press',
    'Lateral raises',
    'Rear-delt fly'
  ],

  Biceps: [
    'Dumbbell curls',
    'Hammer curls'
  ],

  Triceps: [
    'Cable pushdowns',
    'Overhead extensions'
  ],

  Legs: [
    'Squats',
    'Romanian deadlift',
    'Leg press'
  ],

  Core: [
    'Plank',
    'Dead bug',
    'Cable crunch'
  ]
};


// =====================================================
// WELSH-POWELL WORKOUT SCHEDULER
// =====================================================

export function scheduleWorkouts(
  days = 5
) {

  const vertices = MUSCLES
    .map(m => ({
      ...m,
      degree:
        m.conflicts.length
    }))
    .sort(
      (a, b) =>
        b.degree - a.degree
    );


  const assigned = {};


  for (
    const muscle of vertices
  ) {

    const used =
      new Set(
        muscle.conflicts
          .map(
            name =>
              assigned[name]
          )
          .filter(
            value =>
              value !== undefined
          )
      );


    let color = 0;


    while (
      used.has(color) &&
      color < days
    ) {
      color++;
    }


    assigned[muscle.name] =
      color < days
        ? color
        : color % days;
  }


  // Always return all 7 days so the
  // user can add custom exercises
  // to Saturday/Sunday too.

  return Array.from(
    {
      length: 7
    },
    (_, i) => ({

      day: i,

      name: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ][i],

      groups:
        i < days
          ? MUSCLES
              .filter(
                m =>
                  assigned[m.name] === i
              )
              .map(m => ({
                ...m,
                exercises: [
                  ...WORKOUTS[m.name]
                ]
              }))
          : []
    })
  );
}