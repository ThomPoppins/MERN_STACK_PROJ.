import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../../../config'
import PropTypes from 'prop-types'
import { AiOutlineClose } from 'react-icons/ai'
import { FcBriefcase, FcBusinessman } from 'react-icons/fc'

const CompanyModal = ({ company, onClose, owners }) => {
  const [logoPreview, setLogoPreview] = useState('')

  if (company.logoId) {
    axios
      .get(`${BACKEND_URL}/files/image-url/${company.logoId}`)
      .then((response) => {
        setLogoPreview(response.data.imageURL)
      })
  }

  useEffect(() => {
    if (company.logoId) {
      axios
        .get(`${BACKEND_URL}/files/image-url/${company.logoId}`)
        .then((response) => {
          setLogoPreview(response.data.imageURL)
        })
    }
  }, [company])

  return (
    <div
      className='fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/60'
      data-testid='company-modal-container'
      onClick={onClose}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
      role='button'
      tabIndex={0}
    >
      {/* stopPropagation() prevents the modal to close when user clicks inside the Modal but it closes when user clicks outside of the modal. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className='relative m-4 flex h-auto w-[600px] max-w-full flex-col rounded-lg border-2 border-purple-900 bg-violet-950/40 px-4 py-2'
        data-testid='company-modal'
        onClick={(event) => event.stopPropagation()}
        role='button'
        tabIndex={0}
      >
        <AiOutlineClose
          className='absolute right-6 top-6 cursor-pointer text-3xl text-green-300 hover:text-red-500'
          data-testid='close-button'
          onClick={onClose}
        />
        <h2 className='w-fit rounded-lg bg-purple-500 px-4 py-1'>
          {company.startYear}
        </h2>
        <h4 className='my-2 text-gray-500'>KVK: {company.kvkNumber}</h4>
        <div className='mb-4 flex items-center justify-center gap-x-2'>
          <img
            alt={company.name}
            className='h-[250px] w-[250px] rounded-full'
            src={logoPreview}
          />
        </div>
        <div className='flex items-center justify-start gap-x-2'>
          <FcBriefcase className='text-2xl text-red-300' />
          <h2 className='my-1'>{company.name}</h2>
        </div>
        <div className='flex items-center justify-start gap-x-2'>
          <FcBusinessman className='text-2xl text-red-300' />
          <h2 className='my-1'>
            {owners?.map((owner) => `${owner.firstName} ${owner.lastName}`)}
          </h2>
        </div>
        <p className='mt-4'>
          <strong>{company.slogan}</strong>
        </p>
        <p className='my-2'>{company.description}</p>
      </div>
    </div>
  )
}
CompanyModal.propTypes = {
  company: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    slogan: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    logoId: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    kvkNumber: PropTypes.string.isRequired,
    owners: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
      }),
    ).isRequired,
    startYear: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  owners: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    }),
  ),
}

CompanyModal.defaultProps = {
  owners: [],
}

export default CompanyModal
