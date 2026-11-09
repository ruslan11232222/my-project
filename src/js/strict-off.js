(function () {
    console.log("--- НЕСТРОГИЙ РЕЖИМ ---");
    const check = (label, fn) => {
        try { console.log(label, "→", fn()); } 
        catch (error) { console.log(label, "→", `${error.name}: ${error.message}`); }
    };

    check("Неоголошена змінна", () => { undeclaredOff = 1; return undeclaredOff; });
    check("this у функції", function () { return String(this); });
    
    const frozen = Object.freeze({ a: 1 });
    check("Заморожений об'єкт", () => { frozen.a = 2; return frozen.a; });
    check("Видалення властивості", () => { delete Object.prototype; return "Ігнорується"; });

    check("Інструкція with", () => new Function('with (Math) return PI;')());
    check("Однакові параметри", () => new Function("a", "a", 'return a;')(1, 2));
})();