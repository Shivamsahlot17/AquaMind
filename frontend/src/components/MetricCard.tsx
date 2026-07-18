type Props = {

    title: string;

    value: string;

};

function MetricCard({

    title,

    value

}: Props) {

    return (

        <div
            style={{

                background: "white",

                padding: 20,

                borderRadius: 12,

                boxShadow: "0px 2px 8px rgba(0,0,0,.15)",

                textAlign: "center"

            }}
        >

            <h3>{title}</h3>

            <h1>{value}</h1>

        </div>

    );

}

export default MetricCard;