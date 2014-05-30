<!-- LIST APPLICATION SERVERS -->
<div id="app-servers-list" sytle="display:block;">
    <!-- CONTENT HERE -->
    <form>
        <input type="hidden" id="app-servers-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Servers</b></h3>&nbsp&nbsp
                    <a id="app-servers-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <table>
                    <thead>
                        <tr>                      
                            <th width=''>Name</th>
                            <th width=''>Type</th>
                            <th width=''>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="app-servers-list-table">
                    </tbody>
                </table>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="app-servers-list-part"></span>
                        <span class="all-page" id="app-servers-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="app-servers-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="app-servers-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>