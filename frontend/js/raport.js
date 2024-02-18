async function raport(){
        const products = [
          {
            id: 1,
            name: "Product XYZ",
            price_per_unit: 24.99,
            unit: "piece"
          },
          {
            id: 2,
            name: "Product DEF",
            price_per_unit: 15.49,
            unit: "box"
          },
          {
            id: 3,
            name: "Product GHI",
            price_per_unit: 5.99,
            unit: "packet"
          }
        ];
  
        const doc = new jsPDF();
        let y = 10;
  
        doc.text("Product Report", 10, y);
        y += 10;
  
        products.forEach(product => {
          doc.text(`ID: ${product.id}`, 10, y);
          doc.text(`Name: ${product.name}`, 30, y);
          doc.text(`Price per Unit: $${product.price_per_unit}`, 70, y);
          doc.text(`Unit: ${product.unit}`, 120, y);
          y += 10;
        });
        console.log("UTWORZONO");
        doc.save("product_report.pdf");
}

