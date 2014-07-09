<!-- LIST APPLICATIONS -->
<div id="server-apps-list">
    <form>
        <input type="hidden" id="server-apps-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Applications</b></h3>&nbsp&nbsp
                    <a id="server-apps-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <div class="height-limiter">
                    <table>
                        <thead>
                            <tr>
                                <th width=''>Project</th>                      
                                <th width=''>Name</th>
                                <th width=''>R<?php echo htmlentities("&"); ?>D Point Person</th>
                            </tr>
                        </thead>
                        <tbody id="server-apps-list-table">
                        </tbody>
                    </table>
                </div>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="server-apps-list-part"></span>
                        <span class="all-page" id="server-apps-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="server-apps-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="server-apps-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>