import * as React from 'react';
import { useState } from 'react';
import DatePicker from 'react-multi-date-picker';

export default function HomePage() {
  const publications = [
    {
      value: 'PiataOnline',
      label: 'Piata Severineana (online)',
    },
    {
      value: 'PiataFizic',
      label: 'Piata Severineana (fizic, marti si/sau vineri)',
    },
    {
      value: 'Adevarul',
      label: 'Ziarul Adevarul',
    },
  ];

  const anuntTypes = [
    {
      label: 'Anunt de mediu',
      value: 'mediu',
    },
    {
      label: 'Anunt de publicitate',
      value: 'publicitate',
    },
    {
      label: 'Anunt de pierdere',
      value: 'pierdere',
    },
    {
      label: 'Anunt de recrutare/posturi',
      value: 'recrutare',
    },
    {
      label: 'Citatii',
      value: 'citatie',
    },
    {
      label: 'Licitatie',
      value: 'licitatie',
    },
    {
      label: 'Comunicat de presa',
      value: 'comunicat',
    },
    {
      label: 'Prestari servicii',
      value: 'servicii',
    },
  ];
  const [values, setValues] = useState({
    anunt: '',
    type: 'mediu',
    publication: 'PiataOnline',
    name: '',
    email: '',
    address: '',
    companyName: ''
  });

  const [dates, setDates] = useState([]);

  const [price, setPrice] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  const { anunt, type, publication, name, email, address, companyName } = values;

  React.useEffect(() => {
    const prices = {
      adevarul: {
        name: 'adevarul',
        price: 1.0,
      },
      piata: {
        name: 'piata',
        price: 1.2,
      },
    };
    const calculatePrice = (wordCount, type, dates) => {
      if (['PiataOnline', 'PiataFizic'].includes(type)) {
        const aparitions = dates.length;
        const p = wordCount * prices.piata.price * aparitions;
        const final = p.toFixed(2);
        setPrice(final);
      } else {
        const aparitions = dates.length;
        const p = wordCount * prices.adevarul.price * aparitions;
        const final = p.toFixed(2);
        setPrice(final);
      }
    };
    calculatePrice(anunt.split(' ').length, publication, dates);
  }, [anunt, publication, dates]);

  const handleSubmit= async (e) => {
    e.preventDefault();

    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dateStrings = [];
    dates.forEach((date) => {
      dateStrings.push(date.toString());
    });
    await fetch('/api/sendgrid', {
      body: JSON.stringify({
        companyName: companyName,
        name: name,
        email: email,
        address: address,
        anunt: anunt,
        publication: publication,
        type: type,
        dates: dateStrings,
        price: price,
        today: today,
        tomorrow: tomorrow
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then(async (res) => {
        const result = await res.json();
        console.log(result)
        // console.log('no errors');
        alert("Anuntul a fost trimis cu succes!")
      })
      .catch((error) => {
        console.log(error);
        alert("Te rog incearca din nou, s-a produs o eroare!")
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues({ ...values, [name]: value });
  };

  const handleSelectChange = (
    e
  ) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (

      <main>
        <div className='flex flex-col items-center '>
          {/* <div className='text-4xl font-bold'>Site anunturi</div> */}
          <div className='mt-5 w-full max-w-md'>
            <form
              className='mb-4 w-full rounded bg-white px-8 pt-6 pb-8 shadow-xl'
              onSubmit={handleSubmit}
            >
              <div className='mb-6'>
                <label
                  htmlFor='default-input'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  Text anunt
                </label>
                <textarea
                  id='anunt'
                  value={anunt}
                  onChange={handleChange}
                  name='anunt'
                  rows={8}
                  className='focus:shadow-outline inset-0 mb-3 w-full cursor-auto appearance-none rounded border border-blue-500 leading-tight text-gray-700 shadow focus:outline-none'
                ></textarea>
              </div>
              <div className='mb-6'>
                <label
                  htmlFor='default-input'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  Categoria anuntului
                </label>
                <div className='relative'>
                  <select
                    required
                    className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                    id='type'
                    name='type'
                    value={type}
                    onChange={handleSelectChange}
                  >
                    {anuntTypes.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='mb-6'>
                <label
                  htmlFor='default-input'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  Alege publicatia
                </label>
                <div className='relative'>
                  <select
                    required
                    className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                    id='publication'
                    name='publication'
                    value={publication}
                    onChange={handleSelectChange}
                  >
                    {publications.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <label
                htmlFor='default-input'
                className='mb-2 block text-sm font-bold text-gray-700'
              >
                Alege data publicarii
              </label>
              <DatePicker
                required
                multiple
                value={dates}
                onChange={setDates}
              />

              <div className='mb-6'>
                <label
                  htmlFor='default-input'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  Nume firma
                </label>
                <input
                  id='companyName'
                  value={companyName}
                  onChange={handleChange}
                  name='companyName'
                  type='text'
                  className='focus:shadow-outline inset-0 w-full cursor-auto appearance-none rounded border border-blue-500  leading-tight text-gray-700 shadow focus:outline-none'
                ></input>
                
              </div>

              <div className='mb-6'>
                <label
                  htmlFor='default-input'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  Nume complet
                </label>
                <input
                  required
                  id='name'
                  value={name}
                  onChange={handleChange}
                  name='name'
                  type='text'
                  className='focus:shadow-outline peer inset-0 w-full cursor-auto appearance-none rounded border border-blue-500 leading-tight text-gray-700 shadow focus:outline-none'
                ></input>
                <p className='invisible font-light text-red-700 peer-invalid:visible'>
                  Te rog completeaza numele!
                </p>
              </div>

              <div className='mb-6'>
                <label
                  htmlFor='default-input'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  Email
                </label>
                <input
                  required
                  id='email'
                  value={email}
                  onChange={handleChange}
                  name='email'
                  type='email'
                  className='focus:shadow-outline peer inset-0 w-full cursor-auto appearance-none rounded border border-blue-500  leading-tight text-gray-700 shadow focus:outline-none'
                ></input>
                <p className='invisible font-light text-red-700 peer-invalid:visible'>
                  Te rog completeaza un email valid!
                </p>
              </div>

              <div className='mb-6'>
                <label
                  htmlFor='default-input'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  Adresa
                </label>
                <input
                  required
                  id='address'
                  value={address}
                  onChange={handleChange}
                  name='address'
                  type='text'
                  className='focus:shadow-outline peer inset-0 w-full cursor-auto appearance-none rounded border border-blue-500  leading-tight text-gray-700 shadow focus:outline-none'
                ></input>
                <p className='invisible font-light text-red-700 peer-invalid:visible'>
                  Te rog completeaza adresa!
                </p>
              </div>

              

              <div className='flex items-center justify-between pt-5'>
                <button
                  className='focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none'
                  type='button'
                  onClick={() => setIsCalculated(true)}
                >
                  Calculeaza pretul
                </button>
                {isCalculated ? (
                  <div className='text-right'>
                    Pretul total: {price} lei (include TVA)
                  </div>
                ) : (
                  <></>
                )}
                <div className='hidden'></div>
              </div>
              <div className='flex items-center justify-between pt-5'>
                <button
                  className='focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none'
                  type='submit'
                >
                  Trimite anuntul
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
  );
}
