window.addEventListener("message", function (event) {
    var data = event.data;
    switch (data.type) {
        case "OpenUI":
            app.OpenUI(data.Items);
        break;
    }
});

const app = new Vue({
    el: "#app",
    
    data: {
        show: false,
        items: [
          { itemname: 'sandwich', label: 'Sandwich', category:'Food', price: 3},
          { itemname: 'coffe', label: 'Kahve', category:'Items', price: 4},
        ],
        selectedCategory: 'All',
        SepetItems : [],
        totalprice: 0,
    },

    methods: {
        OpenUI: function (items) {
            this.show = true
            this.items = items
        },

        postMessage: function(url,data) {
          fetch(`https://${GetParentResourceName()}/${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          })
         },

         handleKeyUp: function(e) {
          if (e.key == "Escape") {
            this.show = false
            this.postMessage('CloseNUI')
            }
        },

        AddSepet: function(item) {
        var sepetdenelervar = this.SepetItems.find(sepetitem => sepetitem.itemname === item.itemname);
          if (sepetdenelervar) {
            this.postMessage("Error", 'Zaten Sepetinizde Var');
            return;
          }
          var newItem = { itemname: item.itemname, label: item.label, category: item.category, price: item.price, tiklandi: 1 };
          this.SepetItems.push(newItem);
        },
      
        SepetKontrol(name, durum) {
          const sepetItem = this.SepetItems.find(item => item.itemname === name);
            if (sepetItem) {
              if (!durum) {
              sepetItem.tiklandi -= 1;
                if (sepetItem.tiklandi === 0) {
                  this.SepetItems.splice(this.SepetItems.indexOf(sepetItem), 1);
                }
              } else {
              sepetItem.tiklandi += 1;
            }
          }
        },
      
        calculateTotalPrice() {
          this.totalprice = 0;
          this.totalprice = this.SepetItems.reduce((total, item) => total + (item.price * item.tiklandi), 0);
          return this.totalprice;
        },
    
        filterItems(category) {
          this.selectedCategory = category;
        },
    
        Gapa() {
          this.show = !this.show;
          this.SepetItems = []
          this.postMessage("CloseNUI", {});
        },
    
        Satinalindi(neresi) {
            if (neresi == "bank") {
              if (this.calculateTotalPrice() > 0) {
                for (let index = 0; index < this.SepetItems.length; index++) {
                  const element = this.SepetItems[index];
                  this.postMessage("Satinalindi", {itemname: element.itemname, tiklandi: element.tiklandi, neresi: "bank", totalprice: this.totalprice});
                  this.show = false
                }
                this.SepetItems = []
              }
            } else if (neresi == "cash") {
              if (this.calculateTotalPrice() > 0) {
                for (let index = 0; index < this.SepetItems.length; index++) {
                  const element = this.SepetItems[index];
                  this.postMessage("Satinalindi", {itemname: element.itemname, tiklandi: element.tiklandi, neresi: "cash", totalprice: this.totalprice});
                  this.show = false
                }
                this.SepetItems = []
                }
            }
        },
    },

    computed: {
        filteredItems() {
          if (this.selectedCategory === 'All') {
            return this.items;
          } else {
            return this.items.filter(item => item.category === this.selectedCategory);
          }
        },
    },

    mounted() {
      window.addEventListener('keyup', this.handleKeyUp);
    },
    
    destroyed() {
      window.removeEventListener('keyup', this.handleKeyUp);
    },
})