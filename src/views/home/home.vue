<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">

        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                
                <div class="line-chart-con">
                    <fundFixedInvest></fundFixedInvest>
                </div>
            </Card>
            </Col>
        </Row>

        <Footer class="layout-footer-center">2018 &copy; 滚雪球 <a href="http://www.beian.miit.gov.cn">京ICP备14018244号-3</a></Footer>

    </div>
</template>

<script>
    import fundFixedInvest from '../stockIndex/fundFixedInvest.vue';

    export default {
        name: 'home',
        components: {
            fundFixedInvest
        },
        data () {
            return {
                count: {
                    createUser: 496,
                    visit: 3264,
                    collection: 24389305,
                    transfer: 39503498
                },
                showAddNewTodo: false,
                newToDoItemValue: ''
            };
        },
        computed: {
            avatorPath () {
                return localStorage.avatorImgPath;
            }
        },
        methods: {
            addNewToDoItem () {
                this.showAddNewTodo = true;
            },
            addNew () {
                if (this.newToDoItemValue.length !== 0) {
                    this.toDoList.unshift({
                        title: this.newToDoItemValue
                    });
                    setTimeout(() => {
                        this.newToDoItemValue = '';
                    }, 200);
                    this.showAddNewTodo = false;
                } else {
                    this.$Message.error('请输入待办事项内容');
                }
            },
            cancelAdd () {
                this.showAddNewTodo = false;
                this.newToDoItemValue = '';
            }
        }
    };
</script>
<style scoped>
    .layout-footer-center {
        text-align: center;
    }
</style>