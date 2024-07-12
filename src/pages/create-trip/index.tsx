import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom";
import { InviteGuestsModal } from "./invite-guests-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { DestinationAndDateStep } from "./steps/destination-and-date-stape";
import { InviteGuestsStep } from "./steps/invite-guests-step";
import { DateRange } from "react-day-picker";
import { api } from "../../lib/axios";

export function CreateTripPages() {
const navigate = useNavigate()
    
  const [isGuestInputOpen, setIsGuestInputOpen] = useState (false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false) 

  const [destination, setDestination] = useState ('')
  const [ownerName, setOwnerName] = useState ('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndDates, seteventStartAndDates] = useState <DateRange | undefined>()


  const [emailsToInvite, setEmailsToInvite] = useState([
    'lukinhafaustino2001@gmail.com'
  ]);

  function openGuestInput (){
    setIsGuestInputOpen(true)
  }

  function closeGuestInput (){
    setIsGuestInputOpen(false)
  }

  function openGuestModal () {
    setIsGuestModalOpen (true)
  }

  function closeGuestModal () {
    setIsGuestModalOpen (false)
  }

  function OpenConfirmTripModal () {
    setIsConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal () {
    setIsConfirmTripModalOpen (false)
  }

  async function createTrip (event: FormEvent<HTMLFormElement>) {
    event.preventDefault ()
    console.log (destination)
    console.log (eventStartAndDates)
    console.log (emailsToInvite)
    console.log (ownerEmail)
    console.log (ownerName)

    if (!destination){
      return
    }  
    if (!eventStartAndDates?.from || !eventStartAndDates?.to) {
      return
    }

    if (emailsToInvite.length === 0){
      return
    }

    if (ownerEmail || ownerName) {
      return
    }

    const response = await api.post ('/trips', {
      destination,
      starts_at: eventStartAndDates.from,
      ends_at: eventStartAndDates.to,
      emails_to_invite: emailsToInvite,
      ownerName: ownerName,
      ownerEmail: ownerEmail
    })

    const { tripId } = response.data
    navigate (`/trips/123/${tripId}`)
  }

  function addNewEmailToInvite (event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email){
      return
    }

    if (emailsToInvite.includes(email)){
      return
    }

    setEmailsToInvite([
      ...emailsToInvite,
      email
    ])

    event.currentTarget.reset()
  }

  function removeEmailFromInvites (emailToRemove:string) {
    const newEmailList = emailsToInvite.filter(email => email != emailToRemove)

    setEmailsToInvite(newEmailList)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center ">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt ="plann.er"/>
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
          closeGuestInput={closeGuestInput}
          isGuestInputOpen={isGuestInputOpen}
          openGuestInput={openGuestInput}
          setDestination = {setDestination}
          eventStartAndDates = {eventStartAndDates}
          seteventStartAndDates = {seteventStartAndDates}
          />

          {isGuestInputOpen && (
            <InviteGuestsStep 
            OpenConfirmTripModal={OpenConfirmTripModal}
            emailsToInvite={emailsToInvite}
            openGuestModal={openGuestModal}
            />
          )}
        </div>



        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
          com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.
        </p>
      </div>

        {isGuestModalOpen && (
          <InviteGuestsModal 
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          closeGuestModal={closeGuestModal}
          removeEmailFromInvites={removeEmailFromInvites}

          />
        )}

        {isConfirmTripModalOpen && (
            <ConfirmTripModal 
                closeConfirmTripModal={closeConfirmTripModal}
                createTrip={createTrip}
                setOwnerName = {setOwnerName}
                setOwnerEmail = {setOwnerEmail}
            />
        )}

        </div>
  )
}

