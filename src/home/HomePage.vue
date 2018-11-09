<template>
    <div>
        <div class="col-sm-12">
            <router-link to="/login" class="btn btn-primary">Logout</router-link>
        </div>
       <div class="col-sm-12 filter">
           <h2>Filter</h2>
            <input type="radio" v-model="filterTime" value="3" v-on:change="filter"><label>7 hours ago</label>
            <input type="radio" v-model="filterTime" value="2" v-on:change="filter"><label>15 hours ago</label>
            <input type="radio" v-model="filterTime" value="1" v-on:change="filter"><label>24 hours ago</label>
            <input type="radio" v-model="filterTime" value="0" v-on:change="filter"><label>Recent</label>
        </div>
        <div class="col-sm-12">
            <apexcharts width="1500" height="600" :type="chartType" :options="options" :series="series">
            </apexcharts>
            <div class="btn-group-rounded col-xs-12">
                <button class="btn btn-success btn-xs" v-bind:class="{ selectedChartBtnClass: isActive}"  @click="changeChart('interestchart')">Area Chart View</button>
                <button class="btn btn-success btn-xs" v-bind:class="{ selectedChartBtnClass: !isActive}"  @click="changeChart('linechart')">Line Chart View</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
export default {
    components: {
      apexcharts: VueApexCharts,
    },
     data() {
        return {
            filterTime:0,
            isActive:true,
            chartType:'area',
            selectedChartBtnClass:'',
            series: [{
                name: 'Search Volume',
                data: []
            }],
            SeriesPrice:[],
            XaxisTime:[],
            filteredSeriesPrice:[],
            filteredXaxisTime:[],
            monthlySeries:[],
            reverseSeriesPrice:[],
            reverseXaxisTime:[],
            options: {
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                chart: {
                    id: 'vuechart-example',
                    sparkline: {
                        enabled: false,
                    }
                },
                yaxis: {
                    seriesName: 'Search Volume',
                    opposite: false,
                    tickAmount: 10,
                },
                xaxis: {
                    categories: [],
                    labels: {
                        show: false,
                    }
                },
            },
        }
     },
    computed: {
        ...mapState({
            account: state => state.account,
            users: state => state.users.all
        })
    },
    mounted () {
        this.loadChartData();
    },
    created () {
        this.getAllUsers();
    },
    methods: {
        ...mapActions('users', {
            getAllUsers: 'getAll',
            deleteUser: 'delete'
        }),
        loadChartData(){
            axios.get('https://cors-anywhere.herokuapp.com/https://www.gbm.com.mx/Mercados/ObtenerDatosGrafico?empresa=IPC', { headers: { 'Access-Control-Allow-Origin':'*'}})
            .then(response => {
                console.log(response)
                for (var i=0;i<response.data.resultObj.length;i++)
                {
                    this.XaxisTime[i] = response.data.resultObj[i].Fecha;
                    this.SeriesPrice[i] = response.data.resultObj[i].Precio;
                }
                while(this.filteredSeriesPrice.length > 0) {
                    this.filteredSeriesPrice.length.pop();
                    this.filteredXaxisTime.length.pop();
                }
                this.XaxisTime = this.XaxisTime.reverse();
                this.SeriesPrice = this.SeriesPrice.reverse();
               this.recentfilter();
            });
        },
        getISOTimeNow(){
            var date = new Date();
            date.setHours(date.getHours() - parseInt(this.filterTime));

            // now you can get the string
            var isodate = date.toISOString();

            // var d = new Date().setDate(beforedate.getHours()-parseInt(this.filterTime));
            // var n = d.toISOString();
            return isodate;
        },
        recentfilter() {
            this.filteredSeriesPrice = [];
            while(this.filteredSeriesPrice.length > 0) {
                    this.filteredSeriesPrice.length.pop();
                    this.filteredXaxisTime.length.pop();
                }
            for (var i=0;i<30;i++)
            {
                
                this.filteredSeriesPrice[i] = this.SeriesPrice[i];
                this.filteredXaxisTime[i] =this.XaxisTime[i];
            }
            this.options = {
                xaxis: {categories:this.filteredXaxisTime}
            };
            this.series = [{
                data: this.filteredSeriesPrice
            }];
        },
        filter() {
            if(this.filterTime == 0)
            {
                this.recentfilter();
            }
            else{
                var count = this.XaxisTime.length;
                var filterCount = count/parseInt(this.filterTime);
                console.log(count);
                this.filteredSeriesPrice = [];
                console.log(this.filteredSeriesPrice);
                while(this.filteredSeriesPrice.length > 0) {
                    this.filteredSeriesPrice.length.pop();
                    this.filteredXaxisTime.length.pop();
                }
                for (var i=0;i<filterCount;i++)
                {
                    this.filteredSeriesPrice[i] = this.SeriesPrice[i];
                    this.filteredXaxisTime[i] = this.XaxisTime[i];
                }
                this.options = {
                    xaxis: {categories:this.filteredXaxisTime}
                };
                this.series = [{
                    data: this.filteredSeriesPrice
                }];
            }
        },
        changeChart(select)
        {
            if(select === 'linechart')
            {
                this.isActive = false;
                this.chartType = 'bar';
                this.options = {
                    dataLabels:{enabled:false},
                    xaxis: {categories:this.filteredXaxisTime,
                        labels: {
                            show: false,
                            }
                    },
                    yaxis: {
                        opposite: false,
                        tickAmount: 10,
                    },
                };
            }
            else{
                this.isActive = true;
                this.chartType = 'area';
                this.options = {
                    dataLabels:{enabled:false},
                    xaxis: {categories:this.filteredXaxisTime,
                        labels: {
                            show: false,
                            }
                    },
                    yaxis: {
                        opposite: false,
                        tickAmount: 10,
                    },
                };
            }
        }
    }
};
</script>
<style>
    .btn-group-rounded .selectedChartBtnClass {
        color: white;
        background: #2da6e9;
        border-bottom: 2px solid #168ccd;
    }
    .filter{
        margin: 20px;
    }
    .filter label{
        margin-right: 5px;
        margin-left: 5px;
    }
</style>