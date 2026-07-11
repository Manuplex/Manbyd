import Image from "next/image";

export default function Validateorder(){
    return (
        <div className="bg-white justify-items-center py-12 mx-4 align-items-center">
            <Image src="/right.png" alt="Validation" width={200} height={250} />
            <p className="font-medium text-2xl text-gray-600">Commande validée avec <span className="text-blue-600">succès</span></p>
            <p className="text-gray-500 text-lg">Veuillez vérifier votre compte whatsapp, pour continuer le processus de paiement</p>
        </div>
    )
}