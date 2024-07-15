import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CircleCheck } from "lucide-react";

interface Activity {
    data: string
    activities: {
        id: string
        title: string
        occurs_at: string
    }[]
}

export function Activities() {
    const { tripId } = useParams();
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        api.get(`/trips/${tripId}/activities`).then(response => {
            console.log("Received data:", response.data.activities);
            setActivities(response.data.activities);
        });
    }, [tripId]);

    return (
        <div className="space-y-8">
            {activities.map(category => {
                console.log("Processing category:", category);
                const date = category.data ? parseISO(category.data) : null;
                const isDateValid = date && isValid(date);

                return (
                    <div key={category.data || Math.random().toString()} className="space-y-2.5">
                        <div className="flex gap-2 items-baseline">
                            {isDateValid ? (
                                <>
                                    <span className="text-xl text-zinc-300 font">Dia {format(date, 'd', { locale: ptBR })}</span>
                                    <span className="text-xs text-zinc-500">{format(date, 'EEEE', { locale: ptBR })}</span>
                                </>
                            ) : (
                                <span className="text-xl text-red-500 font">Data inválida</span>
                            )}
                        </div>
                        {category.activities.length > 0 ? (
                            <div>
                                {category.activities.map(activity => {
                                    console.log("Processing activity:", activity);
                                    const occursAt = activity.occurs_at ? parseISO(activity.occurs_at) : null;
                                    const isOccursAtValid = occursAt && isValid(occursAt);

                                    return (
                                        <div key={activity.id} className="space-y-2.5">
                                            <div className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                                                <CircleCheck className="size-5 text-lime-300" />
                                                <span className="text-zinc-100">{activity.title}</span>
                                                <span className="text-zinc-400 text-sm ml-auto">
                                                    {isOccursAtValid ? `${format(occursAt, 'HH:mm')}h` : 'Horário inválido'}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
