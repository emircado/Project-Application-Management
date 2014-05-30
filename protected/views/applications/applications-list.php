<!-- LIST APPLICATIONS -->
<div id="applications-list">
    <form>
        <input type="hidden" id="applications-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Applications</b></h3>&nbsp&nbsp
                    <a id="applications-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <table>
                    <thead>
                        <tr>                      
                            <th width=''>Name</th>
                            <th width=''>R<?php echo htmlentities("&"); ?>D Point Person</th>
                        </tr>
                    </thead>
                    <tbody id="applications-list-table">
                    </tbody>
                </table>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="applications-list-part"></span>
                        <span class="all-page" id="applications-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="applications-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="applications-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>