// src/services/characterGenerator.js

// Schema is now part of the generator service
export const schema = {
  identity: [
    { key: 'name', type: 'string', label: 'name', default: '' },
    { key: 'dob', type: 'date', label: 'dob', default: '' },
    { key: 'is_alive', type: 'boolean', label: 'is_alive', default: true },
    { key: 'dod', type: 'date', label: 'dod', default: '' },
    { key: 'gender', type: 'enum', label: 'gender', options: ['male', 'female'], default: '' },
    {
      key: 'marital_status',
      type: 'enum',
      label: 'marital_status',
      options: ['single', 'married', 'divorced', 'widowed'],
      default: '',
    },
    { key: 'nationality', type: 'string', label: 'nationality', default: '' },
    { key: 'birth_place', type: 'string', label: 'birth_place', default: '' },
    { key: 'residence', type: 'string', label: 'residence', default: '' },
    { key: 'occupation', type: 'string', label: 'occupation', default: '' },
    { key: 'languages', type: 'array', label: 'languages', default: [] },
    { key: 'description', type: 'textarea', label: 'description', default: '' },
  ],
  // The 'family' section now defines fields, just like 'identity'.
  // NOTE: This schema is for the form structure, not the data shape itself.
  family: [
    { key: 'father_name', type: 'string', label: 'father_name', group: 'parents', default: '' },
    {
      key: 'father_status',
      type: 'enum',
      label: 'father_status',
      group: 'parents',
      options: ['alive', 'deceased'],
      default: 'alive',
    },
    { key: 'mother_name', type: 'string', label: 'mother_name', group: 'parents', default: '' },
    {
      key: 'mother_status',
      type: 'enum',
      label: 'mother_status',
      group: 'parents',
      options: ['alive', 'deceased'],
      default: 'alive',
    },
  ],
  physical: [
    {
      key: 'height_cm',
      type: 'number',
      label: 'height_cm',
      min: 50,
      max: 250,
      default: 175,
      suffix: 'cm',
    },
    {
      key: 'weight_kg',
      type: 'number',
      label: 'weight_kg',
      min: 3,
      max: 300,
      default: 75,
      suffix: 'kg',
    },
    {
      key: 'skin_tone',
      type: 'enum',
      label: 'skin_tone',
      options: ['fair', 'light', 'olive', 'brown', 'dark'],
    },
    {
      key: 'build',
      type: 'enum',
      label: 'build',
      options: ['slim', 'athletic', 'average', 'stout', 'muscular', 'heavy'],
    },
    {
      key: 'clothing_style',
      type: 'enum',
      label: 'clothing_style',
      options: ['casual', 'formal', 'vintage', 'modern', 'sporty'],
    },
    {
      key: 'hair_color',
      type: 'enum',
      label: 'hair_color',
      options: ['black_hair', 'brown_hair', 'blonde', 'red', 'gray_hair', 'white'],
    },
    {
      key: 'eye_color',
      type: 'enum',
      label: 'eye_color',
      options: ['brown_eye', 'black_eye', 'blue', 'green', 'gray', 'hazel'],
    },
    {
      key: 'face_shape',
      type: 'enum',
      label: 'face_shape',
      options: ['oval', 'round', 'square', 'heart', 'long'],
    },
    { key: 'distinguishing_marks', type: 'array', label: 'distinguishing_marks', default: [] },
  ],
  psychology: {
    personality_type: {
      type: 'enum',
      options: [
        'INTJ',
        'INTP',
        'INFJ',
        'INFP',
        'ISTJ',
        'ISTP',
        'ISFJ',
        'ISFP',
        'ENTJ',
        'ENTP',
        'ENFJ',
        'ENFP',
        'ESTJ',
        'ESTP',
        'ESFJ',
        'ESFP',
      ],
      label: 'personality_type',
      default: '',
    },
    traits: {
      type: 'traits',
      options: [
        'kind',
        'curious',
        'aggressive',
        'patient',
        'brave',
        'anxious',
        'optimistic',
        'pessimistic',
        'perfectionist',
        'impulsive',
        'creative',
        'analytical',
        'dominant',
        'submissive',
        'humorous',
        'serious',
        'empathetic',
        'stoic',
        'ambitious',
        'lazy',
      ],
      label: 'traits',
      default: [],
    },
    values: { type: 'array', default: [], label: 'values' },
    fears: { type: 'array', default: [], label: 'fears' },
  },
  voice: [
    {
      key: 'voice_gender',
      type: 'enum',
      label: 'voice_gender',
      options: ['male', 'female', 'neutral'],
    },
    {
      key: 'tone',
      type: 'enum',
      label: 'tone',
      options: ['calm', 'energetic', 'formal', 'casual', 'warm', 'cold'],
    },
    { key: 'pace', type: 'enum', label: 'pace', options: ['slow', 'moderate', 'fast'] },
    { key: 'accent', type: 'string', label: 'accent' },
    { key: 'catchphrases', type: 'array', label: 'catchphrases' },
  ],
  movement: [
    {
      key: 'posture',
      type: 'enum',
      label: 'posture',
      options: ['straight_posture', 'relaxed', 'slouched'],
    },
    {
      key: 'gait',
      type: 'enum',
      label: 'gait',
      options: ['slow', 'medium_gait', 'fast', 'confident', 'limping'],
    },
    { key: 'gestures', type: 'array', label: 'gestures' },
    { key: 'notes', type: 'string', label: 'notes' },
  ],
  health: [
    { key: 'medical_conditions', type: 'array', label: 'medical_conditions' },
    { key: 'bio', type: 'textarea', label: 'bio' },
  ],
}

export function randomizeCharacter(fakers, schema, locale) {
  const fk = fakers[locale]
  const isFa = locale === 'fa'

  const getAge = (dob) => {
    if (!dob) return 0
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    return age
  }

  const iranianLocations = [
    { city: 'تهران', accent: 'تهرانی', languages: ['فارسی'] },
    { city: 'اصفهان', accent: 'اصفهانی', languages: ['فارسی'] },
    { city: 'تبریز', accent: 'ترکی', languages: ['ترکی', 'فارسی'] },
    { city: 'مشهد', accent: 'مشهدی', languages: ['فارسی'] },
    { city: 'شیراز', accent: 'شیرازی', languages: ['فارسی'] },
    { city: 'سنندج', accent: 'کردی', languages: ['کردی', 'فارسی'] },
    { city: 'اهواز', accent: 'جنوبی', languages: ['فارسی', 'عربی'] },
  ]
  const worldLocations = [
    {
      country: 'United States',
      nationality: 'American',
      cities: ['New York', 'Los Angeles', 'Chicago'],
      mainLanguage: 'English',
      accents: ['New York', 'Californian', 'Midwestern'],
    },
    {
      country: 'France',
      nationality: 'French',
      cities: ['Paris', 'Marseille', 'Lyon'],
      mainLanguage: 'French',
      accents: ['Parisian', 'Southern French'],
    },
    {
      country: 'Japan',
      nationality: 'Japanese',
      cities: ['Tokyo', 'Osaka', 'Kyoto'],
      mainLanguage: 'Japanese',
      accents: ['Tokyo', 'Kansai'],
    },
  ]

  let nationality, birth_place, residence, languages, accent
  if (isFa) {
    const birthLocation = fk.helpers.arrayElement(iranianLocations)
    nationality = 'ایرانی'
    birth_place = birthLocation.city
    languages = [...birthLocation.languages]
    if (Math.random() < 0.7) languages.push('انگلیسی')
    accent = birthLocation.accent
    residence = fk.helpers.weightedArrayElement([
      { weight: 7, value: birth_place },
      { weight: 3, value: fk.helpers.arrayElement(iranianLocations).city },
    ])
  } else {
    const worldLocation = fk.helpers.arrayElement(worldLocations)
    nationality = worldLocation.nationality
    birth_place = fk.helpers.arrayElement(worldLocation.cities)
    languages = [worldLocation.mainLanguage]
    if (worldLocation.mainLanguage !== 'English' && Math.random() < 0.9) languages.push('English')
    accent = fk.helpers.arrayElement(worldLocation.accents)
    residence = fk.helpers.weightedArrayElement([
      { weight: 7, value: birth_place },
      { weight: 3, value: fk.helpers.arrayElement(worldLocation.cities) },
    ])
  }

  const characterGender = fk.helpers.arrayElement(['male', 'female'])
  const fatherLastName = isFa ? fk.person.lastName() : fk.person.lastName('male')
  let paternalLastName, characterLastName, spouseLastName

  characterLastName = fatherLastName
  if (characterGender === 'male') {
    paternalLastName = fatherLastName
    spouseLastName = isFa ? fk.person.lastName() : fk.person.lastName('female')
    if (Math.random() < 0.3) spouseLastName = paternalLastName
  } else {
    paternalLastName = isFa ? fk.person.lastName() : fk.person.lastName('male')
    spouseLastName = paternalLastName
  }

  const dob = fk.date.birthdate({ min: 18, max: 80, mode: 'age' })
  const age = getAge(dob)

  const form = {}

  form.identity = {
    name: fk.person.firstName(characterGender) + ' ' + characterLastName,
    dob: dob.toISOString().split('T')[0],
    is_alive: fk.helpers.weightedArrayElement([
      { weight: 9, value: true },
      { weight: 1, value: false },
    ]),
    dod: '',
    gender: characterGender,
    marital_status: fk.helpers.arrayElement(['single', 'married', 'divorced', 'widowed']),
    nationality,
    birth_place,
    residence,
    languages,
    occupation: fk.person.jobTitle(),
    description: fk.lorem.sentence(),
  }
  if (!form.identity.is_alive) {
    form.identity.dod = fk.date
      .past({ years: Math.min(age, 15), refDate: new Date() })
      .toISOString()
      .split('T')[0]
  }

  form.family = {
    father_name: fk.person.firstName('male') + ' ' + fatherLastName,
    father_status: fk.helpers.arrayElement(['alive', 'deceased']),
    mother_name:
      fk.person.firstName('female') +
      ' ' +
      (isFa ? fk.person.lastName() : fk.person.lastName('female')),
    mother_status: fk.helpers.arrayElement(['alive', 'deceased']),
    spouse: null,
    children: [],
  }

  if (form.identity.marital_status !== 'single' && age > 20) {
    const spouseGender = characterGender === 'male' ? 'female' : 'male'
    const spouseDob = fk.date.birthdate({ min: Math.max(18, age - 5), max: age + 5, mode: 'age' })
    form.family.spouse = {
      name: fk.person.firstName(spouseGender) + ' ' + spouseLastName,
      dob: spouseDob.toISOString().split('T')[0],
      status: fk.helpers.weightedArrayElement([
        { weight: 9, value: 'alive' },
        { weight: 1, value: 'deceased' },
      ]),
    }

    const canHaveChildren =
      form.identity.marital_status === 'married' || form.identity.marital_status === 'widowed'
    if (canHaveChildren && age > 22) {
      const numChildren = fk.number.int({ min: 0, max: 4 })
      const motherDob = characterGender === 'female' ? new Date(dob) : new Date(spouseDob)
      for (let i = 0; i < numChildren; i++) {
        const earliestBirthYear = motherDob.getFullYear() + 18
        const latestBirthYear = motherDob.getFullYear() + 45
        if (earliestBirthYear >= latestBirthYear) continue

        const childBirthYear = fk.number.int({
          min: earliestBirthYear,
          max: Math.min(latestBirthYear, new Date().getFullYear()),
        })
        const childDob = fk.date.between({
          from: new Date(childBirthYear, 0, 1),
          to: new Date(childBirthYear, 11, 31),
        })
        const childGender = fk.helpers.arrayElement(['male', 'female'])
        form.family.children.push({
          name: fk.person.firstName(childGender) + ' ' + paternalLastName,
          dob: childDob.toISOString().split('T')[0],
          gender: childGender,
          status: fk.helpers.weightedArrayElement([
            { weight: 19, value: 'alive' },
            { weight: 1, value: 'deceased' },
          ]),
        })
      }
    }
  }

  let height =
    characterGender === 'male'
      ? fk.number.int({ min: 165, max: 195 })
      : fk.number.int({ min: 155, max: 180 })
  const baseWeight = (height - 100) * 0.9
  let weight = Math.round(baseWeight + fk.number.int({ min: -10, max: 15 }))

  form.physical = {
    height_cm: height,
    weight_kg: weight,
    skin_tone: fk.helpers.arrayElement(schema.physical.find((f) => f.key === 'skin_tone').options),
    build: fk.helpers.arrayElement(schema.physical.find((f) => f.key === 'build').options),
    clothing_style: fk.helpers.arrayElement(
      schema.physical.find((f) => f.key === 'clothing_style').options,
    ),
    hair_color: fk.helpers.arrayElement(
      schema.physical.find((f) => f.key === 'hair_color').options,
    ),
    eye_color: fk.helpers.arrayElement(schema.physical.find((f) => f.key === 'eye_color').options),
    face_shape: fk.helpers.arrayElement(
      schema.physical.find((f) => f.key === 'face_shape').options,
    ),
    distinguishing_marks: fk.helpers.arrayElements(
      isFa
        ? ['خال روی گونه', 'جای زخم روی پیشانی', 'تتو']
        : ['mole on cheek', 'scar on forehead', 'tattoo'],
      { min: 1, max: 2 },
    ),
  }

  form.psychology = {
    personality_type: fk.helpers.arrayElement(schema.psychology.personality_type.options),
    traits: fk.helpers
      .arrayElements(schema.psychology.traits.options, { min: 4, max: 7 })
      .map((tr) => ({
        name: tr,
        intensity: Math.round(fk.number.int({ min: 20, max: 95 }) / 5) * 5,
      })),
    values: fk.helpers.arrayElements(
      isFa ? ['صداقت', 'خانواده', 'آزادی'] : ['Honesty', 'Family', 'Freedom'],
      { min: 2, max: 4 },
    ),
    fears: fk.helpers.arrayElements(
      isFa ? ['عنکبوت', 'ارتفاع', 'تنهایی'] : ['Spiders', 'Heights', 'Loneliness'],
      { min: 1, max: 3 },
    ),
  }

  form.voice = {
    voice_gender: fk.helpers.arrayElement(
      schema.voice.find((f) => f.key === 'voice_gender').options,
    ),
    tone: fk.helpers.arrayElement(schema.voice.find((f) => f.key === 'tone').options),
    pace: fk.helpers.arrayElement(schema.voice.find((f) => f.key === 'pace').options),
    accent: accent,
    catchphrases: fk.helpers.arrayElements(
      isFa ? ['در واقع...', 'خلاصه...'] : ['You know?', 'Basically...'],
      { min: 1, max: 2 },
    ),
  }

  form.movement = {
    posture: fk.helpers.arrayElement(schema.movement.find((f) => f.key === 'posture').options),
    gait: fk.helpers.arrayElement(schema.movement.find((f) => f.key === 'gait').options),
    gestures: fk.helpers.arrayElements(
      isFa
        ? ['با دست اشاره می‌کند', 'سرش را می‌خاراند']
        : ['Uses hands when talking', 'Nods frequently'],
      { min: 1, max: 2 },
    ),
    notes: isFa ? 'وقتی عصبی است با انگشتانش بازی می‌کند.' : 'Fidgets when nervous.',
  }

  form.health = {
    medical_conditions: fk.datatype.boolean(0.3)
      ? fk.helpers.arrayElements(isFa ? ['آلرژی', 'میگرن'] : ['Allergy', 'Migraines'], {
          min: 1,
          max: 2,
        })
      : [],
    bio: fk.lorem.paragraph(),
  }

  return form
}
