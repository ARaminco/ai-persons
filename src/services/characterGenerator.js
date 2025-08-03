import faTranslations from './locales/fa.json'
import enTranslations from './locales/en.json'

// Create a combined translations object for internal use
const allTranslations = {
  fa: faTranslations,
  en: enTranslations,
}

export const schema = {
    identity:[
      {key:'name', type:'string', label:'name', default:''}, {key:'dob', type:'date', label:'dob', default:''},
      {key:'is_alive', type:'boolean', label:'is_alive', default: true}, {key:'dod', type:'date', label:'dod', default:''},
      {key:'gender', type:'enum', label:'gender', options:['male','female'], default:''},
      {key:'marital_status', type:'enum', label:'marital_status', options:['single','married','divorced','widowed'], default:''},
      {key:'nationality', type:'string', label:'nationality', default:''}, {key:'birth_place', type:'string', label:'birth_place', default:''},
      {key:'residence', type:'string', label:'residence', default:''}, {key:'occupation', type:'string', label:'occupation', default:''},
      {key:'languages', type:'array', label:'languages', default:[]}, {key:'description', type:'textarea', label:'description', default:''},
    ],
    family: [
        { key: 'father_name', type: 'string', label: 'father_name', group: 'parents', default: '' },
        { key: 'father_status', type: 'enum', label: 'father_status', group: 'parents', options:['alive','deceased'], default: 'alive' },
        { key: 'mother_name', type: 'string', label: 'mother_name', group: 'parents', default: '' },
        { key: 'mother_status', type: 'enum', label: 'mother_status', group: 'parents', options:['alive','deceased'], default: 'alive' },
    ],
    physical:[
      {key:'height_cm', type:'number', label:'height_cm', min:50, max:250, default:175, suffix:'cm'}, {key:'weight_kg', type:'number', label:'weight_kg', min:3, max:300, default:75, suffix:'kg'},
      {key:'skin_tone', type:'enum', label:'skin_tone', options:['fair', 'light', 'olive', 'brown', 'dark'], default:'light'}, {key:'build', type:'enum', label:'build', options:['slim', 'athletic', 'average', 'stout', 'muscular', 'heavy'], default: 'average'},
      {key:'clothing_style', type:'enum', label:'clothing_style', options:['casual', 'formal', 'vintage', 'modern', 'sporty'], default: 'casual'},
      {key:'hair_color', type:'enum', label:'hair_color', options:['black_hair','brown_hair','blonde','red','gray_hair','white'], default: 'brown_hair'},
      {key:'eye_color', type:'enum', label:'eye_color', options:['brown_eye','black_eye','blue','green','gray','hazel'], default: 'brown_eye'},
      {key:'face_shape', type:'enum', label:'face_shape', options:['oval','round','square','heart','long'], default: 'oval'},
      {key:'distinguishing_marks', type:'array', label:'distinguishing_marks', default:[]},
    ],
    psychology:{
      personality_type:{type:'enum', options:['INTJ','INTP','INFJ','INFP','ISTJ','ISTP','ISFJ','ISFP','ENTJ','ENTP','ENFJ','ENFP','ESTJ','ESTP','ESFJ','ESFP'], label: 'personality_type', default: ''},
      traits:{type:'traits', options:['kind','curious','aggressive','patient','brave','anxious','optimistic','pessimistic','perfectionist','impulsive','creative','analytical','dominant','submissive','humorous','serious','empathetic','stoic','ambitious','lazy'], label: 'traits', default: []},
      values:{type:'array', default:[], label: 'values'},
      fears:{type:'array', default:[], label: 'fears'}
    },
    voice:[
      {key:'voice_gender', type:'enum', label:'voice_gender', options:['male','female','neutral'], default: 'male'}, {key:'tone', type:'enum', label:'tone', options:['calm','energetic','formal','casual','warm','cold'], default: 'calm'},
      {key:'pace', type:'enum', label:'pace', options:['slow','moderate','fast'], default: 'moderate'}, {key:'accent', type:'string', label:'accent', default: ''}, {key:'catchphrases', type:'array', label:'catchphrases', default: []},
    ],
    movement:[
      {key:'posture', type:'enum', label:'posture', options:['straight_posture','relaxed','slouched'], default: 'straight_posture'}, {key:'gait', type:'enum', label:'gait', options:['slow','medium_gait','fast','confident','limping'], default: 'medium_gait'},
      {key:'gestures', type:'array', label:'gestures', default: []}, {key:'notes', type:'string', label:'notes', default: ''},
    ],
    health:[ {key:'medical_conditions', type:'array', label:'medical_conditions', default: []}, {key:'bio', type:'textarea', label:'bio', default: ''} ]
};

/**
 * Generates a meaningful biography for the character.
 */
function generateBio(characterData, locale) {
  const t = (key) => allTranslations[locale]?.[key] || key;
  const { identity, physical, psychology } = characterData;
  const age = new Date().getFullYear() - new Date(identity.dob).getFullYear();
  const mainTrait = psychology.traits[0]?.name || 'unknown';

  if (locale === 'fa') {
    return `${identity.name} یک ${t(identity.gender)} ${age} ساله و ${identity.nationality} است که به عنوان ${t(identity.occupation)} فعالیت می‌کند. او با قد ${physical.height_cm} سانتی‌متر و هیکل ${t(physical.build)}، شخصیتی ${t(mainTrait)} دارد.`;
  }

  return `${identity.name} is a ${age}-year-old ${t(identity.gender)} from ${identity.nationality} who works as a(n) ${t(identity.occupation)}. With a height of ${physical.height_cm}cm and a(n) ${t(physical.build)} build, they have a personality that is best described as ${t(mainTrait)}.`;
}


export function randomizeCharacter(fakers, schema, locale) {
    const fk = fakers[locale];
    const isFa = locale === 'fa';
    let form = {};

    // Initialize form with default values from schema
    for (const sectionKey in schema) {
        form[sectionKey] = {};
        const sectionSchema = schema[sectionKey];
        if (Array.isArray(sectionSchema)) {
            sectionSchema.forEach(field => {
                form[sectionKey][field.key] = field.default ?? (field.type === 'array' ? [] : '');
            });
        } else {
            for (const fieldKey in sectionSchema) {
                const field = sectionSchema[fieldKey];
                form[sectionKey][fieldKey] = field.default ?? (field.type === 'array' || field.type === 'traits' ? [] : '');
            }
        }
    }
    form.family.spouse = null;
    form.family.children = [];

    const getAge = (dob) => {
        if (!dob) return 0;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const iranianLocations = [
        { city: 'تهران', accent: 'تهرانی', languages: ['فارسی'] }, { city: 'اصفهان', accent: 'اصفهانی', languages: ['فارسی'] },
        { city: 'تبریز', accent: 'ترکی', languages: ['ترکی', 'فارسی'] }, { city: 'مشهد', accent: 'مشهدی', languages: ['فارسی'] },
        { city: 'شیراز', accent: 'شیرازی', languages: ['فارسی'] },
    ];
    const worldLocations = [
        { country: 'United States', nationality: 'American', cities: ['New York', 'Los Angeles'], mainLanguage: 'English', accents: ['New York', 'Californian'] },
        { country: 'France', nationality: 'French', cities: ['Paris', 'Marseille'], mainLanguage: 'French', accents: ['Parisian', 'Southern French'] },
        { country: 'Japan', nationality: 'Japanese', cities: ['Tokyo', 'Osaka'], mainLanguage: 'Japanese', accents: ['Tokyo', 'Kansai'] },
    ];

    let nationality, birth_place, residence, languages, accent;
    if (isFa) {
        const birthLocation = fk.helpers.arrayElement(iranianLocations);
        nationality = 'ایرانی'; birth_place = birthLocation.city;
        languages = [...birthLocation.languages]; if (Math.random() < 0.7) languages.push('انگلیسی');
        accent = birthLocation.accent; residence = fk.helpers.weightedArrayElement([{weight: 7, value: birth_place}, {weight: 3, value: fk.helpers.arrayElement(iranianLocations).city}]);
    } else {
        const worldLocation = fk.helpers.arrayElement(worldLocations);
        nationality = worldLocation.nationality; birth_place = fk.helpers.arrayElement(worldLocation.cities);
        languages = [worldLocation.mainLanguage]; if (worldLocation.mainLanguage !== 'English' && Math.random() < 0.9) languages.push('English');
        accent = fk.helpers.arrayElement(worldLocation.accents); residence = fk.helpers.weightedArrayElement([{weight: 7, value: birth_place}, {weight: 3, value: fk.helpers.arrayElement(worldLocation.cities)}]);
    }

    const characterGender = fk.helpers.arrayElement(schema.identity.find(f => f.key === 'gender').options);
    const fatherLastName = isFa ? fk.person.lastName() : fk.person.lastName('male');
    let paternalLastName, characterLastName, spouseLastName;

    characterLastName = fatherLastName;
    if (characterGender === 'male') {
        paternalLastName = fatherLastName;
        spouseLastName = isFa ? fk.person.lastName() : fk.person.lastName('female');
        if (Math.random() < 0.3) spouseLastName = paternalLastName;
    } else {
        paternalLastName = isFa ? fk.person.lastName() : fk.person.lastName('male');
        spouseLastName = paternalLastName;
    }

    form.family.father_name = fk.person.firstName('male') + ' ' + fatherLastName;
    form.family.father_status = fk.helpers.arrayElement(schema.family.find(f => f.key === 'father_status').options);
    form.family.mother_name = fk.person.firstName('female') + ' ' + (isFa ? fk.person.lastName() : fk.person.lastName('female'));
    form.family.mother_status = fk.helpers.arrayElement(schema.family.find(f => f.key === 'mother_status').options);

    const dob = fk.date.birthdate({ min: 18, max: 80, mode: 'age' });
    const age = getAge(dob);

    form.identity = {
        ...form.identity,
        name: fk.person.firstName(characterGender) + ' ' + characterLastName,
        dob: dob.toISOString().split('T')[0],
        is_alive: fk.helpers.weightedArrayElement([{weight: 9, value: true}, {weight: 1, value: false}]),
        gender: characterGender,
        marital_status: fk.helpers.arrayElement(schema.identity.find(f => f.key === 'marital_status').options),
        nationality, birth_place, residence, languages,
        occupation: fk.person.jobTitle(),
    };
    form.identity.dod = form.identity.is_alive ? '' : fk.date.past({years: Math.min(age, 15)}).toISOString().split('T')[0];

    if (form.identity.marital_status !== 'single' && age > 20) {
        const spouseGender = characterGender === 'male' ? 'female' : 'male';
        const spouseDob = fk.date.birthdate({min: Math.max(18, age - 5), max: age + 5, mode: 'age'});
        form.family.spouse = {
            name: fk.person.firstName(spouseGender) + ' ' + spouseLastName,
            dob: spouseDob.toISOString().split('T')[0],
            status: fk.helpers.weightedArrayElement([{weight: 9, value: 'alive'}, {weight: 1, value: 'deceased'}])
        };

        if ((form.identity.marital_status === 'married' || form.identity.marital_status === 'widowed') && age > 22) {
            const numChildren = fk.number.int({min: 0, max: 4});
            const motherDob = (characterGender === 'female' ? new Date(dob) : new Date(spouseDob));
            for (let i = 0; i < numChildren; i++) {
                const earliestBirthYear = motherDob.getFullYear() + 18;
                const latestBirthYear = Math.min(motherDob.getFullYear() + 45, new Date().getFullYear());
                if(earliestBirthYear >= latestBirthYear) continue;

                const childBirthYear = fk.number.int({min: earliestBirthYear, max: latestBirthYear});
                const childDob = fk.date.between({ from: new Date(childBirthYear, 0, 1), to: new Date(childBirthYear, 11, 31) });
                const childGender = fk.helpers.arrayElement(['male', 'female']);
                form.family.children.push({
                    name: fk.person.firstName(childGender) + ' ' + paternalLastName,
                    dob: childDob.toISOString().split('T')[0],
                    gender: childGender,
                    status: fk.helpers.weightedArrayElement([{weight: 19, value: 'alive'}, {weight: 1, value: 'deceased'}])
                });
            }
        }
    }

    let height = characterGender === 'male' ? fk.number.int({ min: 165, max: 195 }) : fk.number.int({ min: 155, max: 180 });
    const baseWeight = (height - 100) * 0.9;
    let weight = Math.round(baseWeight + fk.number.int({min: -10, max: 15}));

    form.physical = {
        ...form.physical,
        height_cm: height, weight_kg: weight,
        skin_tone: fk.helpers.arrayElement(schema.physical.find(f => f.key === 'skin_tone').options),
        build: fk.helpers.arrayElement(schema.physical.find(f => f.key === 'build').options),
        clothing_style: fk.helpers.arrayElement(schema.physical.find(f => f.key === 'clothing_style').options),
        hair_color: fk.helpers.arrayElement(schema.physical.find(f => f.key === 'hair_color').options),
        eye_color: fk.helpers.arrayElement(schema.physical.find(f => f.key === 'eye_color').options),
        face_shape: fk.helpers.arrayElement(schema.physical.find(f => f.key === 'face_shape').options),
        distinguishing_marks: fk.helpers.arrayElements(isFa ? ['خال روی گونه', 'جای زخم', 'تتو'] : ['mole on cheek', 'scar', 'tattoo'], {min: 1, max: 2})
    };

    form.psychology = {
      ...form.psychology,
      personality_type: fk.helpers.arrayElement(schema.psychology.personality_type.options),
      traits: fk.helpers.arrayElements(schema.psychology.traits.options, {min:4, max:7}).map(tr => ({ name: tr, intensity: Math.round(fk.number.int({ min: 20, max: 95 }) / 5) * 5 })),
      values: fk.helpers.arrayElements(isFa ? ['صداقت', 'خانواده', 'آزادی'] : ['Honesty', 'Family', 'Freedom'], {min:2, max:4}),
      fears: fk.helpers.arrayElements(isFa ? ['عنکبوت', 'ارتفاع', 'تنهایی'] : ['Spiders', 'Heights', 'Loneliness'], {min:1, max:3})
    };

    form.voice = {
      ...form.voice,
      voice_gender: fk.helpers.arrayElement(schema.voice.find(f => f.key === 'voice_gender').options),
      tone: fk.helpers.arrayElement(schema.voice.find(f => f.key === 'tone').options),
      pace: fk.helpers.arrayElement(schema.voice.find(f => f.key === 'pace').options),
      accent: accent,
      catchphrases: fk.helpers.arrayElements(isFa ? ['در واقع...', 'خلاصه...'] : ['You know?', 'Basically...'], {min:1, max:2})
    };

    form.movement = {
      ...form.movement,
      posture: fk.helpers.arrayElement(schema.movement.find(f => f.key === 'posture').options),
      gait: fk.helpers.arrayElement(schema.movement.find(f => f.key === 'gait').options),
      gestures: fk.helpers.arrayElements(isFa ? ['با دست اشاره می‌کند', 'سرش را می‌خاراند'] : ['Uses hands when talking', 'Nods frequently'], {min:1, max:2}),
      notes: isFa ? 'وقتی عصبی است با انگشتانش بازی می‌کند.' : 'Fidgets when nervous.'
    };

    form.health = {
      ...form.health,
      medical_conditions: fk.datatype.boolean(0.3) ? fk.helpers.arrayElements(isFa ? ['آلرژی', 'میگرن'] : ['Allergy', 'Migraines'], {min:1, max:2}) : [],
    };

    // Generate Bio using the dedicated function AFTER all data is created
    const bio = generateBio(form, locale);
    form.identity.description = bio;
    form.health.bio = bio;

    return form;
}
