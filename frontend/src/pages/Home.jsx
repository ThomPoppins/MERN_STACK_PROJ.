import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from '../../config';
import Layout from '../components/layout/Layout';
import e from 'cors';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  // @ts-ignore
  const userId = useSelector((state) => state.userId);

  // Ping animation when the find button is clicked
  const [findButtonPing, setFindButtonPing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const handleFindExpertsQuery = (e) => {
    e.preventDefault();

    setFindButtonPing(true);

    // ! TODO: Remove this timeout when the query is implemented and redirects to the search page
    setTimeout(() => {
      setFindButtonPing(false);
    }, 5000);
  };

  // Search query input change handler
  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (userId) {
    return (
      <Layout>
        <div className='mt-32'>
          <div className='mx-auto'>
            <div className='mx-auto min-h-[440px] lg:w-9/12 border border-purple-900 bg-violet-950/40 rounded-xl p-4 '>
              <img
                src={`${BACKEND_URL}/logo/vind-expert-transparent.png`}
                alt='profile picture'
                className='w-32 h-32 mt-8 ml-3 mr-8 rounded-xl float-left object-cover'
              />
              <div className='ml-4'>
                <h1 className='text-6xl mt-11'>Vind-Expert</h1>
                <div className='relative'>
                  <div className='ml-0 mt-6 mb-3 w-1/2 float-left'>
                    <p className=''>
                      Search any keywords to find the best relevant professionals in your area
                      first.
                    </p>
                  </div>
                  <div className='absolute top-[120px] left-[172px] w-full mt-6 mb-3'>
                    <input
                      type='text'
                      className='absolute right-[400px] top-[-34px] h-[50px]  border-2 border-purple-900 bg-cyan-100 focus:bg-white rounded-xl text-gray-800 py-2 px-4 mt-6 w-2/3'
                      placeholder='For example: plumber, electrician, gardener, developer, something else...'
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) =>
                        (e.target.placeholder =
                          'For example: plumber, electrician, gardener, developer, something else...')
                      }
                      value={searchQuery}
                      onChange={handleSearchQueryChange}
                      data-test-id='find-expert-search-query-input'
                    />
                    <button
                      className={`absolute top-[-41px] right-[195px] h-[50px] w-[160px] bg-gradient-to-r  rounded-lg m-8 pl-4  ${
                        findButtonPing
                          ? 'animate-ping-once bg-gradient-to-l from-green-500 to-green-400'
                          : // : "animate-bounce hover:animate-none"
                            'animate-bounce-fast  from-violet-500 to-violet-600 hover:bg-gradient-to-l hover:from-green-500 hover:to-green-400'
                      }`}
                      onClick={handleFindExpertsQuery}
                      data-test-id='find-button'
                    >
                      <div className='mx-auto'>
                        <div className='py-2 ml-7 text-xl float-left'>Find </div>
                        <img
                          src={`${BACKEND_URL}/logo/vind-expert-transparent.png`}
                          alt='Vind-Expert find button'
                          className='w-5 h-5 mt-[13px] mr-8 rounded-xs object-cover ml-2 float-right'
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div className='mx-auto lg:w-9/12 border border-purple-900 bg-violet-950/40 rounded-xl p-4 mt-32'>
          <h1 className='text-3xl mb-6'>Home</h1>

          <p className=''>
            Register and login to your account to see the features of this application in action.
            Account data will only be saved to your own MongoDB database and your password will be
            saved securely hashed by bcrypt.
          </p>
        </div>
      </Layout>
    );
  }
};

export default Home;
