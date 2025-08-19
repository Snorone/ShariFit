import { useState } from "react";
import "./Bmi.css";

const Bmi = () => {
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");

  const calculateBmi = () => {
    if (!weight || !height) return;

    const heightInMeters = height / 100;
    const bmiValue = parseFloat((weight / (heightInMeters ** 2)).toFixed(1));
    setBmi(bmiValue);

    if (bmiValue < 18.5) setCategory("Undervikt");
    else if (bmiValue >= 18.5 && bmiValue <= 24.9) setCategory("Normalvikt");
    else if (bmiValue >= 25 && bmiValue <= 29.9) setCategory("Övervikt");
    else setCategory("Fetma");
  };

  return (
    <div className="bmi-container">
      <h1>📊 BMI Kalkylator</h1>
      <div className="bmi-card">
        <label>
          Vikt (kg)
          <input
            type="number"
            value={weight}
            onChange={(e) =>
              setWeight(e.target.value ? parseFloat(e.target.value) : "")
            }
            placeholder="Ange din vikt"
          />
        </label>

        <label>
          Längd (cm)
          <input
            type="number"
            value={height}
            onChange={(e) =>
              setHeight(e.target.value ? parseFloat(e.target.value) : "")
            }
            placeholder="Ange din längd"
          />
        </label>

        <button onClick={calculateBmi}>Beräkna BMI</button>

        {bmi && (
          <div className={`bmi-result ${category.toLowerCase()}`}>
            <p>
              Ditt BMI: <strong>{bmi}</strong>
            </p>
            <p>Kategori: {category}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bmi;